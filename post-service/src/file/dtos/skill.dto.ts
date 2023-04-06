import {
    IsNotEmpty,
    IsNumber,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class SkillDto {
    skill_id: number;

    skill_name: string;
}