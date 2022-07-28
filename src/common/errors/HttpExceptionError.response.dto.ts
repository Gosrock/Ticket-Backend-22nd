import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EnumToArray } from '../utils/enumNumberToArray';
import { HttpErrorNameEnum } from './HttpErrorNameEnum';

export class HttpExceptionErrorResponseDto {
  @ApiProperty({
    enum: HttpErrorNameEnum,
    description: '에러명'
  })
  @Expose()
  error: string;

  @ApiProperty({
    type: String,
    description: '에러메시지'
  })
  @Expose()
  message: string;

  @ApiProperty({
    enum: EnumToArray(HttpStatus),
    description: '상태코드 400~500번대만 봐주세용'
  })
  @Expose()
  statusCode: number;

  constructor(statusCode: number, error: string, message: string) {
    this.error = error;
    this.statusCode = statusCode;
    this.message = message;
  }

  //   @ApiProperty({ type: () => PageMetaDto })
  //   @Type(() => PageMetaDto)
  //   @Expose()
  //   readonly meta: PageMetaDto;

  //   constructor(data: T[], meta: PageMetaDto) {
  //     this.data = data;
  //     this.meta = meta;
  //   }
}
