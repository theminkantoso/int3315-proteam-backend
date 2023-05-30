import { SkillService } from './../services/skill.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


@ApiTags('Skill')
@Controller('skills')
@ApiBearerAuth()
// @ApiBasicAuth()
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiOperation({ summary: 'Skill' })
  @ApiResponse({ status: 200, description: 'List skill' })
  // @UseGuards(JwtAuthGuard)
  @Get()
  async skills() {
    return instanceToPlain(this.skillService.skills());
  }

}