import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), forwardRef(() => AuthModule)],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository],
  exports: [TicketsService]
})
export class TicketsModule {}
