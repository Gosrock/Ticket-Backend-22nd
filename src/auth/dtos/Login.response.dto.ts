import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Order } from 'src/database/entities/order.entity';
import { BaseResponseValidateNumberDto } from './BaseValidateNumber.response.dto';

export class LoginResponseDto extends PickType(BaseResponseValidateNumberDto, [
  'accessToken',
  'alreadySingUp'
] as const) {
  @ApiProperty({
    description:
      '이미 가입했는지에대한 정보, 인증용 토큰, 회원가입용 토큰 분기처리용',
    type: Boolean,
    example: true
  })
  @Expose()
  alreadySingUp: boolean;
}
