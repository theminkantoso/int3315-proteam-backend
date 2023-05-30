import { classToPlain, instanceToPlain } from 'class-transformer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from '../services/post.service';
import { AuthGuard } from '@nestjs/passport';
import { PostDto, PostReqDto } from '../dtos';
import { RmqService } from 'src/common/rabbit/rabbitmq.service';

@ApiTags('Post')
@Controller('')
@ApiBearerAuth()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly rmqService: RmqService,
  ) {}

  @ApiOperation({ summary: 'all post' })
  @ApiResponse({ status: 200, description: 'List post of user' })
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async allPosts(@Req() req: Request) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    return this.postService.allPosts(acc_id);
  }

  @ApiOperation({ summary: 'post of user' })
  @ApiResponse({ status: 200, description: 'List post of user' })
  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async posts(@Req() req: Request) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    return this.postService.postsByAccId(acc_id);
  }

  @ApiOperation({ summary: 'get post by id' })
  @ApiResponse({ status: 200, description: 'post by id' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async postById(
    @Req() req: Request,
    @Query('post_id', ParseIntPipe) post_id?: number,
  ) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    return this.postService.getPostById(acc_id, post_id);
  }

  @ApiOperation({ summary: 'create post' })
  @ApiResponse({ status: 200, description: 'create post' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPost(
    @Req() req: Request,
    @Body() postDto: PostReqDto,
  ): Promise<any> {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    if (postDto != null && postDto.min_gpa == null) {
      postDto.min_gpa = 0;
    }
    if (postDto != null && postDto.max_gpa == null) {
      postDto.max_gpa = 4;
    }
    // this.rmqService.getMessage(postDto);
    return this.postService.createPost(acc_id, postDto);
  }

  @ApiOperation({ summary: 'update post' })
  @ApiResponse({ status: 200, description: 'update post' })
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updatePost(
    @Req() req: Request,
    @Body() postDto: PostReqDto,
    @Query('post_id', ParseIntPipe) post_id?: number,
  ): Promise<any> {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    if (postDto != null && postDto.min_gpa == null) {
      postDto.min_gpa = 0;
    }
    if (postDto != null && postDto.max_gpa == null) {
      postDto.max_gpa = 4;
    }
    return this.postService.updatePost(acc_id, post_id, postDto);
  }

  @ApiOperation({ summary: 'delete post' })
  @ApiResponse({ status: 200, description: 'delete post by post id' })
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deletePost(
    @Req() req: Request,
    @Query('post_id', ParseIntPipe) post_id?: number,
  ): Promise<any> {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    return this.postService.delete(acc_id, post_id);
  }

  @ApiOperation({ summary: 'list post of other user' })
  @ApiResponse({ status: 200, description: 'List post of other user' })
  @UseGuards(AuthGuard('jwt'))
  @Get('other-user')
  async postsByUserId(
    @Req() req: Request,
    @Query('user_id', ParseIntPipe) user_id?: number,
  ) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 3;
    return this.postService.postsByOtherUserId(acc_id, user_id);
  }
}
