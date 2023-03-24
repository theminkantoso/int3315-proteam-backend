import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
export class SearchDto {

    @IsString()
    name: string;

    @IsString()
    school: string;

    @IsString()
    major: string;

    @IsNumber()
    min_gpa: number;

    @IsNumber()
    max_gpa: number;

    @IsNumber()
    @IsArray()
    skills: number[];
}