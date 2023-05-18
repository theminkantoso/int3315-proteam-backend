import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { StatsService } from "../services/stats.service";
import {
    ApiBadRequestResponse,
    ApiBasicAuth,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { instanceToPlain } from 'class-transformer';
import { StatsQueryDto } from '../dtos/stats_query.dto';
import { SchoolStatsDto } from '../dtos/school_stats.dto';

@ApiTags('Stats (ADMIN account required)')
@Controller('school')
export class SchoolStatsController {
    constructor(private readonly statsService: StatsService) {}

  // @ApiOperation({ summary: 'Stats school' })
  // @ApiResponse({ status: 200, description: 'count number of students studying in each schools or majors' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // async GetStatsSchool(@Req() req: Request, @Body() filters: SchoolStatsDto): Promise<any> {
  //   let school = filters.school ? filters.school : '';
  //   return await this.statsService.getStatsSchool(school);
  // }

  @ApiOperation({ summary: 'Stats school' })
  @ApiResponse({ status: 200, description: 'count number of students studying in each schools or majors' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'school', description: "school filter", required: false, type: String})
  @Get()
  async GetStatsSchool(@Query('school') school?: string): Promise<any> {
    school = school ? school : '';
    return await this.statsService.getStatsSchool(school);
  }
}