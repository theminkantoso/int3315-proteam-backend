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

@ApiTags('Stats (ADMIN account required)')
@Controller('gpa')
// @ApiBearerAuth()
export class GPAStatsController {
    constructor(private readonly statsService: StatsService) {}

  // @ApiOperation({ summary: 'Stats GPA' })
  // @ApiResponse({ status: 200, description: 'count number of students that GPA in different ranges (gioi, kha, v.v) in different category' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // async GetStatsGPA(@Req() req: Request, @Body() filters: StatsQueryDto): Promise<any> {
  //   let school = filters.school ? filters.school : '';
  //   let major = filters.major ? filters.major : '';
  //   let skill = filters.skill ? filters.skill : 0;
  //   return await this.statsService.getStatsGPA(school, major, skill);
  // }

  @ApiOperation({ summary: 'Stats GPA' })
  @ApiResponse({ status: 200, description: 'count number of students that GPA in different ranges (gioi, kha, v.v) in different category' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'school', description: "school filter, optional", required: false, type: String})
  @ApiQuery({ name: 'major', description: "major filter, optional, but should be aligned with school (ex UEB AND major CNTT -> khong phu hop)", 
  required: false, type: String})
  @ApiQuery({ name: 'skill', description: "skill filter, optional, INTEGER", required: false, type: Number })
  @Get()
  async GetStatsGPA(@Query('school') school?: string,
                    @Query('major') major?: string,
                    @Query('skill') skill?: number): Promise<any> {
    school = school ? school : '';
    major = major ? major : '';
    skill = skill ? skill : 0;
    return await this.statsService.getStatsGPA(school, major, skill);
  }

  // @ApiOperation({ summary: 'Stats skill' })
  // @ApiResponse({ status: 200, description: 'count number of students that have skills in different category' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @ApiQuery({ name: 'school', description: "school filter, optional", required: false })
  // @ApiQuery({ name: 'major', description: "major filter, optional, but should be aligned with school (ex UEB AND major CNTT -> khong phu hop)", required: false})
  // @ApiQuery({ name: 'hoc_luc', description: "gpa filter, optional, 5 choices: xuat_sac, gioi, kha, trung_binh, yeu", required: false })
  // @Get()
  // async GetStatsSkill(@Query('school') school?: string,
  //                     @Query('major') major?: string,
  //                     @Query('hoc_luc') hoc_luc?: string): Promise<any> {
  //   school = school ? school : '';
  //   major = major ? major : '';
  //   hoc_luc = hoc_luc ? hoc_luc : '';
  //   return await this.statsService.getStatsSkill(school, major, hoc_luc);
  // }
}