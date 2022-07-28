import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RequestUserNameDto {
  @ApiProperty({ description: '변경 유저 이름', type: String })
  @IsString()
  @MinLength(2)
  @MaxLength(4)
  @Expose()
  name: string;
}