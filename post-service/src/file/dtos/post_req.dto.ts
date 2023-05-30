import {
    IsString,
    IsArray,
    IsNotEmpty,
    IsNumber,
    Min, Max
  } from 'class-validator';
  import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EMPTY } from 'rxjs';
export class PostReqDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({default: ""})
    content: string;

    @IsString()
    @ApiProperty({default: ""})
    image: string;

    @IsString()
    @ApiProperty({default: ""})
    file: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({default: []})
    skills: number[];

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
}