import {
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
export class NotiFirebaseDto {
    @IsString()
    @ApiProperty({default: ""})
    device_type: string;

    @IsString()
    @ApiProperty({default: ""})
    notification_token: string;
}