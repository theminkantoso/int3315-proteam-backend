import {
    IsNotEmpty,
    IsNumber,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class FriendRequestDto {

    @IsNumber()
    @ApiProperty({default: 1})
    friend_id: number;
}