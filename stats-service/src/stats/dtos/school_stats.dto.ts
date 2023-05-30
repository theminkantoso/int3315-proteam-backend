import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';

export class SchoolStatsDto {

    @IsOptional()
    @IsString()
    @ApiProperty({description: "school filter", required: false })
    school: string;
}