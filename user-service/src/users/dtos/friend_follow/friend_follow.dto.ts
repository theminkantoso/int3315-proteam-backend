import {
    IsNotEmpty,
    IsNumber,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class FriendFollowDto {

    account_id: number;

    friend_id: number;

    status: number;
}