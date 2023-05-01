import {
    IsString,
    IsArray,
    IsNotEmpty,
    IsNumber,
    Min, Max
  } from 'class-validator';
  import { ApiProperty, PartialType } from '@nestjs/swagger';
export class NotiDto {

    @IsNumber()
    account_id: number;

    @IsString()
    @ApiProperty({default: ""})
    description: string;

    @IsNumber()
    @ApiProperty({default: ""})
    is_read: number;

    @IsString()
    @ApiProperty({default: new Date()})
    create_time: Date;

    @IsString()
    type: string;
}