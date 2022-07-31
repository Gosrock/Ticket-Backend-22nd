import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/common/consts/enum';

export class ResponseUserTicketNumDto {
  @ApiProperty({
    description: '유저의 고유 아이디입니다.',
    type: Number
  })
  @Expose()
  public id: number;

  @ApiProperty({
    description: '유저의 입금자명입니다.',
    type: String
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: '유저의 휴대전화번호 입니다.',
    type: String
  })
  @Expose()
  public phoneNumber: string;

  @ApiProperty({
    description: '유저의 권한입니다.',
    enum: Role
  })
  @Expose()
  public role: Role;

  @ApiProperty({
    description: '유저 티켓 수',
    type: Number
  })
  @Expose()
  public ticketNum: number;
}