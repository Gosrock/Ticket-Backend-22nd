import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EnumToArray } from '../utils/enumNumberToArray';
import { HttpErrorNameEnum } from './HttpErrorNameEnum';

export class ValidationErrorResponseDto {
  @ApiProperty({
    type: String,
    description: '에러명',
    example: 'ValidationError'
  })
  @Expose()
  error: string;

  @ApiProperty({
    type: String,
    description: '에러메시지',
    example: '검증오류'
  })
  @Expose()
  message: string;

  @ApiProperty({
    type: Number,
    description: '400 검증오류 고정',
    example: 400
  })
  @Expose()
  statusCode: number;

  @ApiProperty({
    // type: { fieldName: ['errorinfoOfString'] },
    description: '필드 : [에러정보] 형식의 에러정보가 담긴 객체입니다.',
    example: { fieldName: ['errorinfoOfString'] }
  })
  @Expose()
  validationErrorInfo: Record<string, Array<string>>;

  //   @ApiProperty({ type: () => PageMetaDto })
  //   @Type(() => PageMetaDto)
  //   @Expose()
  //   readonly meta: PageMetaDto;

  //   constructor(data: T[], meta: PageMetaDto) {
  //     this.data = data;
  //     this.meta = meta;
  //   }
}
