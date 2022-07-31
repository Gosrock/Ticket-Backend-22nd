import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { SocketModule } from 'src/socket/socket.module';
import { UserRepository } from 'src/database/repositories/user.repository';
import { QueueModule } from 'src/queue/queue.module';
import { QueueService } from 'src/queue/queue.service';
import { UsersModule } from 'src/users/users.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    SocketModule,
    UsersModule, //삭제예정,
    QueueModule
  ],
  providers: [
    TicketsService,
    TicketRepository,
    {
      provide: Logger,
      useValue: new Logger('TicketService')
    }
  ],
  exports: [TicketsService, TicketRepository],
  controllers: [TicketsController]
})
export class TicketsModule {}
