import {
    IsNotEmpty,
    IsNumber,
    IsString,
 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class SkillPostDto {

    post_id: number;

    skill_id: number;
}