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

@ApiTags('Stats (ADMIN account required)')
@Controller('user_stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

  @ApiOperation({ summary: 'Get all information for latter fetching' })
  @ApiResponse({ status: 200, description: 'Schools, majors, skills' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async GetMe(): Promise<any> {
    return await this.statsService.getInformation();
  }
}