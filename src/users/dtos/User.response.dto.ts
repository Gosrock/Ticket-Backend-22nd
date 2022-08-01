import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { User } from 'src/database/entities/user.entity';

export class ResponseUserDto {
  @ApiProperty({ description: '유저 정보', type: User })
  @Expose()
  user: User;

  @ApiProperty({ description: '티켓 개수', type: Number })
  @Expose()
  ticketNum: string;
}