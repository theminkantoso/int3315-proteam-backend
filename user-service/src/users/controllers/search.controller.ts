import { AuthGuard } from '@nestjs/passport';
import { SearchService } from './../services/search.service';
import { SearchDto } from './../dtos/search_user.dto';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


@ApiTags('search')
@Controller('search')
// @ApiBearerAuth()
// @ApiBasicAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'search' })
  @ApiResponse({ status: 200, description: 'List user' })
  // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(JwtAuthGuard)
  @Post('users')
  async search(
  @Body() search: SearchDto ) {
    // const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    return instanceToPlain(this.searchService.searchUser(search));
  }

}