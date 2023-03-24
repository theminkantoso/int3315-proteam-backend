import {
  ArrayMaxSize,
  ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import { Type } from 'class-transformer';
  
export class UpdateSkillsDto {

    @IsArray()
    @IsNotEmpty()
    skills: number[];
}