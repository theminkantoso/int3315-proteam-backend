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
    @ApiProperty({default: 2, description: '2: accept, 1: refuse'})
    status: number;
}