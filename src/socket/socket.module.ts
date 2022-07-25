import { forwardRef, Logger, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { SocketAdminGateway } from './socket-admin.gateway';
import { SocketUserGateway } from './socket-user.gateway';
import { SocketGuard } from './socket.guard';
import { SocketService } from './socket.service';

@Module({
  imports: [forwardRef(() => TicketsModule), AuthModule],
  providers: [
    SocketService,
    SocketAdminGateway,
    SocketUserGateway,
    SocketGuard,
    {
      provide: Logger,
      useValue: new Logger('SocketService')
    }
  ],
  exports: [SocketService, SocketGuard]
})
export class SocketModule {}
