import {
    IsNotEmpty,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({default: "123456"})
    old_password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({default: "1234567"})
    new_password: string;
}