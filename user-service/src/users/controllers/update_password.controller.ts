import { UserService } from '../services/user.service';
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
import { User } from '../entities/user.entity';
import { UpdateMeDto } from '../dtos/update-me.dto';
import { UpdatePasswordDto } from '../dtos';


@ApiTags('Personal Profile')
@Controller('change_password')
@ApiBearerAuth()
// @ApiBasicAuth()
export class UpdatePasswordController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Change password (jwt required)' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  // @UseGuards(JwtAuthGuard)
  @Patch()
  async update_pass( @Body() updatePassDTO: UpdatePasswordDto,) {
    return instanceToPlain(this.userService.update_pass(parseInt('1'), updatePassDTO));
  }

}