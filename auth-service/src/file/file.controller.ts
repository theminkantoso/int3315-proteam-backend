import {
  Controller,
  Post,
  InternalServerErrorException,
  Body,
  Query,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import {
  registerFileSchema,
  RegisterFileDto,
  PresignedUrlQuerySchema,
  PresignedUrlQueryDto,
} from './dto/request/register-file.dto';
import { FileService } from './services/file.service';
import { HttpStatus } from 'src/common/constants';
import { TrimBodyPipe } from 'src/common/pipe/trim.body.pipe';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { ErrorResponse, SuccessResponse } from 'src/common/helper/response';
import { JwtGuard } from 'src/common/guards/jwt.guard';
@Controller('file')
@UseGuards(JwtGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new TrimBodyPipe(), new JoiValidationPipe(registerFileSchema))
    body: RegisterFileDto,
  ) {
    try {
      body.createdBy = req?.loginUser?.id;
      const newFile = await this.fileService.createFile(body);
      return new SuccessResponse(newFile);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/presigned-url')
  async getPresignedUrl(
    @Query(new JoiValidationPipe(PresignedUrlQuerySchema))
    query: PresignedUrlQueryDto,
  ) {
    try {
      const result = await this.fileService.getS3PresignedUrl(
        query.path,
        query.originalName,
      );
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  async getFile(@Param('id', ParseIntPipe) id: number) {
    try {
      const file = await this.fileService.getFileById(id);
      if (!file) {
        const message = 'item not exist';
        return new ErrorResponse(HttpStatus.BAD_REQUEST, message, []);
      }
      return new SuccessResponse(file);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
