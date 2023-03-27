import {
      IsNotEmpty,
      Min,
    } from 'class-validator';
    import { ApiProperty } from '@nestjs/swagger';
  import { type } from 'os';
  import { Type } from 'class-transformer';
  export class PagingDto {
      @IsNotEmpty()
      @ApiProperty({name: 'limit', default: 10})
      @Min(1)
      limit: number;

      @IsNotEmpty()
      @ApiProperty({name: 'page_number', default: 0})
      @Min(0)
      page_number: number;
  }