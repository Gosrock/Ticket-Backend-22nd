import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketAdminGateway } from './socket-admin.gateway';
import { SocketUserGateway } from './socket-user.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [AuthModule],
  providers: [SocketService, SocketAdminGateway, SocketUserGateway],
  exports: [SocketService]
})
export class SocketModule {}
