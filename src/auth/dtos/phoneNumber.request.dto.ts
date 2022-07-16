import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsMobilePhone } from 'class-validator';

export class RequestPhoneNumberDto {
  // 직렬화
  @ApiProperty({ description: '전화번호형식', type: String })
  @IsMobilePhone('ko-KR')
  @Expose()
  phoneNumber: string;
}
