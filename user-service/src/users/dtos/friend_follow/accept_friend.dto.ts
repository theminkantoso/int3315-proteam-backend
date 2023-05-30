import {
    IsNotEmpty,
    IsNumber,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class AcceptFriendDto {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({default: 1})
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({default: 1, description: '1: accept, 2: refuse'})
    status: number;
}