import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';

export class StatsQueryDto {

    @IsOptional()
    @IsString()
    @ApiProperty({description: "school filter", required: false })
    school: string;

    @IsOptional()
    @IsString()
    @ApiProperty({description: "major filter", required: false })
    major: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({description: "skill filter", required: false })
    skill: number;
}