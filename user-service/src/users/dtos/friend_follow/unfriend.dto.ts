import {
    IsNotEmpty,
    IsNumber,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class UnfriendDto {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({default: 1, description: 'id of your friend'})
    friend_id: number;
}