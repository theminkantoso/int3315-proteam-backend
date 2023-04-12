import {
    IsString,
    IsArray,
    IsNotEmpty,
    IsNumber,
    Min, Max
  } from 'class-validator';
  import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EMPTY } from 'rxjs';
import { SkillDto } from './skill.dto';
export class PostResDto {
    @IsNumber()
    post_id: number;

    @IsNumber()
    account_id: number;

    @IsString()
    content: string;

    @IsString()
    @ApiProperty({default: ""})
    image: string;

    @IsString()
    @ApiProperty({default: ""})
    file: string;

    @IsString()
    create_time: Date;

    @IsNumber()
    min_gpa: number;

    @IsNumber()
    max_gpa: number;

    @IsArray()
    skills: SkillDto[];
}