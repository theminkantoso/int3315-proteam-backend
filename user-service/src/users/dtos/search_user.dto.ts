import { Param, Query } from '@nestjs/common';
import { PagingDto } from './paging.dto';
import {
    IsArray,
    IsEmpty,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {

    @IsString()
    @ApiProperty({name: 'name'})
    name: string;

    @IsString()
    @ApiProperty({name: 'school'})
    school: string;

    @IsString()
    @ApiProperty({name: 'major'})
    major: string;

    @IsNumber()
    @Min(0)
    @Max(4)
    @ApiProperty({name: 'min_gpa', default: 0})
    min_gpa: number;

    @IsNumber()
    @Min(0)
    @Max(4)
    @ApiProperty({name: 'max_gpa', default: 4})
    max_gpa: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({name: 'skills', default: []})
    skills: number[];

    // @IsNotEmpty()
    // paging: PagingDto;

    @IsNotEmpty()
    @ApiProperty({name: 'limit', default: 10})
    @Min(1)
    limit: number;

    @IsNotEmpty()
    @ApiProperty({name: 'page_number', default: 0})
    @Min(0)
    page_number: number;
}