import { AuthGuard } from '@nestjs/passport';
import { SearchService } from './../services/search.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchDto } from '../dtos/search.dto';


@ApiTags('search')
@Controller('search')
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'search' })
  @ApiResponse({ status: 200, description: 'List user' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async search(@Req() req: Request,
  @Body() search: SearchDto ) {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    // const acc_id = 1;
    return instanceToPlain(this.searchService.searchUser(acc_id, search));
  }

}