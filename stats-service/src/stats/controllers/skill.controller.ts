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
import { SkillStatsDto } from '../dtos/skill_stats.dto';

@ApiTags('Stats (ADMIN account required)')
@Controller('skill')
// @ApiBearerAuth()
export class SkillStatsController {
    constructor(private readonly statsService: StatsService) {}

  // @ApiOperation({ summary: 'Stats skill' })
  // @ApiResponse({ status: 200, description: 'count number of students that have skills in different category' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // async GetStatsSkill(@Req() req: Request, @Body() filters: SkillStatsDto): Promise<any> {
  //   let school = filters.school ? filters.school : '';
  //   let major = filters.major ? filters.major : '';
  //   let hoc_luc = filters.hoc_luc ? filters.hoc_luc : '';
  //   return await this.statsService.getStatsSkill(school, major, hoc_luc);
  // }

  
  @ApiOperation({ summary: 'Stats skill' })
  @ApiResponse({ status: 200, description: 'count number of students that have skills in different category' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'school', description: "school filter, optional", required: false, type: String})
  @ApiQuery({ name: 'major', description: "major filter, optional, but should be aligned with school (ex UEB AND major CNTT -> khong phu hop)", 
  required: false, type: String})
  @ApiQuery({ name: 'hoc_luc', description: "gpa filter, optional", required: false, 
  enum: ['xuat_sac', 'gioi', 'kha', 'trung_binh', 'yeu']})
  @Get()
  async GetStatsSkill(@Query('school') school?: string,
                      @Query('major') major?: string,
                      @Query('hoc_luc') hoc_luc?: string): Promise<any> {
    school = school ? school : '';
    major = major ? major : '';
    hoc_luc = hoc_luc ? hoc_luc : '';
    return await this.statsService.getStatsSkill(school, major, hoc_luc);
  }
}