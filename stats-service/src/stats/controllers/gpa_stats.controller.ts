import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { StatsService } from "../services/stats.service";
import {
    ApiBadRequestResponse,
    ApiBasicAuth,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { instanceToPlain } from 'class-transformer';
import { StatsQueryDto } from '../dtos/stats_query.dto';

@ApiTags('Stats')
@Controller('gpa')
// @ApiBearerAuth()
export class GPAStatsController {
    constructor(private readonly statsService: StatsService) {}

  @ApiOperation({ summary: 'Stats GPA' })
  @ApiResponse({ status: 200, description: 'all, schools, majors, skills' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async GetStatsGPA(@Req() req: Request, @Body() filters: StatsQueryDto): Promise<any> {
    let school = filters.school ? filters.school : '';
    let major = filters.major ? filters.major : '';
    let skill = filters.skill ? filters.skill : 0;
    return await this.statsService.getStatsGPA(school, major, skill);
  }
}