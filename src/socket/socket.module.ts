import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketController } from './socket.controller';
import { SocketAdminGateway } from './socket-admin.gateway';
import { SocketService } from './socket.service';
import { SocketUserGateway } from './socket-user.gateway';

@Module({
  imports: [AuthModule],
  controllers: [SocketController],
  providers: [SocketService, SocketAdminGateway, SocketUserGateway]
})
export class SocketModule {}
