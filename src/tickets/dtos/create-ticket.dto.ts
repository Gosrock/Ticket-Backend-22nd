import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Ticket } from 'src/database/entities/ticket.entity';

export class CreateTicketDto extends PickType(PartialType(Ticket), [
  'date',
  'order',
  'user',
  'createdAt',
  'updatedAt'
] as const) {
  // @ApiProperty({
  //   description: '주문한 유저에 대한 정보입니다.',
  //   type: () => UserProfileDto
  // })
  // @Expose()
  // user: UserProfileDto;
}
