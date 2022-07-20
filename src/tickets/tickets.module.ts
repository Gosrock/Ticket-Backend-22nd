import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { UsersModule } from 'src/users/users.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), AuthModule,
  UsersModule//삭제예정
],
  providers: [TicketsService, TicketRepository],
  exports: [TicketsService],
  controllers: [TicketsController]
})
export class TicketsModule {}
