import { UserService } from '../services/user.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';


@ApiTags('Personal Profile')
@Controller('profile')
@ApiBearerAuth()
// @ApiBasicAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

//   @ApiOperation({ summary: 'Create cat' })
//   @ApiResponse({ status: 200, description: 'Forbidden.' })
  // @Get()
  // getHello(): string {
  //   const decoded =  this.userService.decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw');
  //   console.log(decoded.sub);
  //   return 'Hi';
  // }

  @ApiOperation({ summary: 'Get personal profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async GetMe(): Promise<any> {
    // const decoded =  this.userService.decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw');
    //   console.log(decoded.sub);
    var user = await this.userService.getOneById(parseInt('1'));
    var user2 = instanceToPlain(user);
    return user2;
  }

  @ApiOperation({ summary: 'Update personal profile' })
  @ApiResponse({ status: 200, description: 'Updated profile' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @Patch()
  async update(
    // @Param('id', ParseIntPipe) id: number,
    @Body() updateDTO: UpdateMeDto,
  ) {
    return instanceToPlain(this.userService.update(parseInt('1'), updateDTO));
  }

  @ApiOperation({ summary: 'Get personal profile from other user' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async getUserById(@Query('id', ParseIntPipe) id?: number): Promise<any> {
    if (await this.userService.areFriend(parseInt('1'), id)) {
      return instanceToPlain(this.userService.getOneById(id));
    } 
    else {
      let profile = await this.userService.getOneById(id);
      const return_profile: Record<string, any> = {};
      return_profile.name = profile.name? profile.name: '';
      return_profile.school = profile.school ? profile.school : '';
      return_profile.major = profile.major? profile.major : '';
      return_profile.avatar = profile.avatar? profile.avatar : '';
      return return_profile;
    }
  }
}