import { UpdateSkillsDto } from '../dtos/update_skills.dto';
import { UserService } from '../services/user.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async GetMe(@Req() req: Request): Promise<any> {
    // console.log("CORS");
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    var user = await this.userService.getOneById(acc_id);
    var user2 = instanceToPlain(user);
    return user2;
  }

  @ApiOperation({ summary: 'Update personal profile' })
  @ApiResponse({ status: 200, description: 'Updated profile' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async update(
    @Req() req: Request,
    @Body() updateDTO: UpdateMeDto,
  ) {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    return instanceToPlain(this.userService.update(acc_id, updateDTO));
  }

  @ApiOperation({ summary: 'Get personal profile from other user. friend status 1 are FRIEND, 2 are sent request, 3 received request, 4 nothing' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserById(@Req() req: Request, 
  @Query('id', ParseIntPipe) id?: number): Promise<any> {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    let relation = await this.userService.getFriend(acc_id, id);
    if(relation) {
      const status = relation.status; 
      let profile = await this.userService.getOneById(id);
      
      if (status == 1) {
        let return_field = instanceToPlain(profile);
        return_field['friend'] = 1;
        return return_field;
      } 
      else if (status == 2) {
        const return_profile: Record<string, any> = {};
        return_profile.account_id = profile.account_id;
        return_profile.name = profile.name? profile.name: '';
        return_profile.school = profile.school ? profile.school : '';
        return_profile.major = profile.major? profile.major : '';
        return_profile.avatar = profile.avatar? profile.avatar : '';
        return_profile.friend = relation.account_id == acc_id ? 2 : 3;
        return return_profile;
      }
    }
    // if (await this.userService.areFriend(acc_id, id)) {
    //   return instanceToPlain(this.userService.getOneById(id));
    // } 
    else {
      let profile = await this.userService.getOneById(id);
      const return_profile: Record<string, any> = {};
      return_profile.account_id = profile.account_id;
      return_profile.name = profile.name? profile.name: '';
      return_profile.school = profile.school ? profile.school : '';
      return_profile.major = profile.major? profile.major : '';
      return_profile.avatar = profile.avatar? profile.avatar : '';
      return_profile.friend = 4;
      return return_profile;
    }
  }

  @ApiOperation({ summary: 'update user skills' })
  @ApiResponse({ status: 200, description: 'Updated skills' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'))
  @Patch("update-skills")
  async updateSkills(@Req() req: Request, @Body() skills: UpdateSkillsDto) {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    return instanceToPlain(this.userService.updateSkills(acc_id, skills));
  }

  @ApiOperation({ summary: 'get user skills' })
  @ApiResponse({ status: 200, description: 'user skills' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'))
  @Patch("skills")
  async skills(@Req() req: Request) {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    return instanceToPlain(this.userService.getSkills(acc_id));
  }

}