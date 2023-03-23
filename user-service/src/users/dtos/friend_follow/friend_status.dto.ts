import {
    IsNotEmpty,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class FriendStatusRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({default: "1"})
    friend_id: number;
}