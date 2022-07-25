import { PickType, PartialType } from '@nestjs/swagger';
import { Ticket } from 'src/database/entities/ticket.entity';

export class TicketOnSocketDto extends PickType(PartialType(Ticket), [
  'uuid',
  'date',
  'status'
] as const) {}
