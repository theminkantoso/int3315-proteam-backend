import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Noti } from '../entities/noti.entities';
import { PostDto } from '../entities/post.dto';

@Injectable()
export class NotiService {
    constructor(@InjectRepository(Noti) private notiRepository: Repository<Noti>) {}
    private readonly logger = new Logger(NotiService.name);
    getHello(): string {
        return 'Hello World!';
      }
    
      createPosts(data: any) {
        this.logger.log('Posts...', data);
        const msg = data["post"];
        // const post: PostDto = {
        //   account_id: msg.account_id,
        //   content: msg.content,
        //   image: msg.image,
        //   file: msg.file,
        //   create_time: new Date(),
        //   min_gpa: msg.min_gpa,
        //   max_gpa: msg.max_gpa,
        // };
        // this.logger.log('Message: ', post);
      }
}