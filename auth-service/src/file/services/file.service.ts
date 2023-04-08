import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { RegisterFileDto } from '../dto/request/register-file.dto';
import { File } from '../entities/file.entity';
import ConfigKey from 'src/common/config/config-key';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { PRESIGNED_URL_EXPIRED_IN } from '../file.constants';
import { ConfigService } from '@nestjs/config';
import { makeFileUrl } from 'src/common/helper/commonFunction';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class FileService {
  constructor(
    private readonly dbManager: EntityManager,
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  private S3Instance = new AWS.S3({
    accessKeyId: this.configService.get(ConfigKey.AWS_ACCESS_KEY_ID),
    secretAccessKey: this.configService.get(ConfigKey.AWS_SECRET_ACCESS_KEY),
    region: this.configService.get(ConfigKey.AWS_REGION),
    signatureVersion: 'v4',
  });
  private readonly bucketName = this.configService.get(ConfigKey.AWS_S3_BUCKET);

  async createFile(file: RegisterFileDto): Promise<RegisterFileDto> {
    try {
      const newFile = {
        file_name: file.fileName,
        original_name: file.originalName,
        path: file.path,
        extension: file.extension,
        size: file.size,
        mimetype: file.mimetype,
        url: makeFileUrl(file.fileName),
      };
      const saveFile = await this.fileRepository.save(newFile);
      return {
        fileName: saveFile.file_name,
        originalName: saveFile.original_name,
        path: saveFile.path,
        extension: saveFile.extension,
        size: saveFile.size,
        mimetype: saveFile.mimetype,
        url: makeFileUrl(saveFile.file_name),
      };
    } catch (error) {
      throw error;
    }
  }

  async getFileById(id: number): Promise<RegisterFileDto> {
    try {
      const file = await this.fileRepository.findOne({
        where: { id },
      });
      return {
        fileName: file.file_name,
        originalName: file.original_name,
        path: file.path,
        extension: file.extension,
        size: file.size,
        mimetype: file.mimetype,
        url: makeFileUrl(file.file_name),
      };
    } catch (error) {
      throw error;
    }
  }

  async getS3PresignedUrl(path: string, originalName: string) {
    try {
      const fileName = path
        ? `${path}/${uuidv4()}_${originalName}`
        : `${uuidv4()}_${originalName}`;
      const presignedUrl = this.S3Instance.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: fileName,
        Expires: PRESIGNED_URL_EXPIRED_IN,
        ACL: 'public-read',
      });
      return {
        path,
        originalName,
        fileName,
        presignedUrl,
      };
    } catch (error) {
      throw error;
    }
  }
}
