import { Param, Query } from '@nestjs/common';
import {
    IsArray,
    IsEmpty,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
  } from 'class-validator';
  import { ApiProperty, PartialType } from '@nestjs/swagger';

class SearchPostDto {

    @IsString()
    @ApiProperty({name: 'content'})
    content: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({name: 'skills', default: []})
    skills: number[];

    @IsNotEmpty()
    @ApiProperty({name: 'limit', default: 10})
    @Min(1)
    limit: number;

    @IsNotEmpty()
    @ApiProperty({name: 'page_number', default: 0})
    @Min(0)
    page_number: number;
}

export class SearchDto extends PartialType(SearchPostDto) {}