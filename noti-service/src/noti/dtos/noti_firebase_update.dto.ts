import {
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
export class UpdateNotiFirebaseDto {
    @IsString()
    @ApiProperty({default: ""})
    device_type: string;
}