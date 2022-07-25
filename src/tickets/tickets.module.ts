import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { SocketModule } from 'src/socket/socket.module';
import { UsersModule } from 'src/users/users.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    SocketModule,
    UsersModule //삭제예정
  ],
  providers: [
    TicketsService,
    TicketRepository,
    {
      provide: Logger,
      useValue: new Logger('TicketService')
    }
  ],
  exports: [TicketsService],
  controllers: [TicketsController]
})
export class TicketsModule {}
