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
    @ApiProperty({description: "school filter, optional", required: false })
    school: string;

    @IsOptional()
    @IsString()
    @ApiProperty({description: "major filter, optional, but should be aligned with school (ex UEB AND major CNTT -> khong phu hop)", required: false })
    major: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({description: "skill filter, optional", required: false })
    skill: number;
}