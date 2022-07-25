import { Logger, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketAdminGateway } from './socket-admin.gateway';
import { SocketUserGateway } from './socket-user.gateway';
import { SocketGuard } from '../auth/guards/Socket.guard';
import { SocketService } from './socket.service';

@Module({
  imports: [AuthModule],
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
  exports: [SocketService]
})
export class SocketModule {}
