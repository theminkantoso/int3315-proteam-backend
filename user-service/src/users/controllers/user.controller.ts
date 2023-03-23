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


@ApiTags('Personal Profile')
@Controller('me')
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
  // @UseGuards(JwtAuthGuard)
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
}