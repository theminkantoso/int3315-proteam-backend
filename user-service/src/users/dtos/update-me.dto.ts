import {
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    Max,
    Min,
    MinLength,
    IsEmail,
    IsUrl,
    IsNumberString
  } from 'class-validator';
  import { ApiProperty, PartialType } from '@nestjs/swagger';
  
class MeDto {
    @IsString()
    @ApiProperty({default: "NGuyen Thi Thu"})
    name: string;

    // @IsString()
    // @IsNumberString()
    // @ParseNumber()
    @IsNumber()
    @Min(0)
    @Max(4)
    @ApiProperty({default: "3.22"})
    gpa: number;
    
    @IsString()
    @ApiProperty({default: "UET"})
    school: string;

    @IsString()
    @ApiProperty({default: "FIT"})
    major: string;

    @IsUrl()
    @ApiProperty({default: "https://ronaldo.com"})
    linkedln_link: string;

    @IsString()
    @ApiProperty({default: "09482757893"})
    phone: string;
}

export class UpdateMeDto extends PartialType(MeDto) {}