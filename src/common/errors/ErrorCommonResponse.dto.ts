import { HttpStatus, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type as transformerType } from 'class-transformer';

import { EnumToArray } from '../utils/enumNumberToArray';

export class ErrorCommonResponse<T> {
  @ApiProperty({ enum: EnumToArray(HttpStatus), description: '상태코드' })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({ type: String, description: '에러 발생시간' })
  @Expose()
  readonly timestamp: Date;

  @ApiProperty({ type: String, description: '에러 발생 url' })
  @Expose()
  readonly path: string;

  @ApiProperty({ type: String, description: '에러 발생 메소드' })
  @Expose()
  readonly method: string;

  @ApiProperty({ type: 'generic', description: '에러 발생 메소드' })
  // @transformerType(options => {
  //   return (options!.newObject as ErrorCommonResponse<T>).errorType!;
  // })
  @Expose()
  error: T;

  @Exclude()
  private errorType?: Type;

  constructor(errorType: Type) {
    this.errorType = errorType;
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
