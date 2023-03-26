import { SearchDto } from './../dtos/search_user.dto';
import { SearchService } from './../services/search.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
@ApiBearerAuth()
// @ApiBasicAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'search' })
  @ApiResponse({ status: 200, description: 'List user' })
  // @UseGuards(JwtAuthGuard)
  @Get()
  async search(@Req() search: SearchDto) {
    return instanceToPlain(this.searchService.searchUser(search));
  }

}