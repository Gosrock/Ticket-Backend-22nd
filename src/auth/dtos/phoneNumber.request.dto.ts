import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class RequestPhoneNumberDto {
  // 직렬화
  @ApiProperty({ description: '전화번호형식', type: String })
  @MinLength(11)
  @MaxLength(11)
  @Matches(/010[0-9]*$/, {
    message: '010으로 시작하는 숫자만 들어와야 합니다.'
  })
  @Expose()
  phoneNumber: string;
}
