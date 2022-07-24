import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketAdminGateway } from './socket-admin.gateway';
import { SocketUserGateway } from './socket-user.gateway';
import { SocketController } from './socket.controller';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [AuthModule],
  controllers: [SocketController],
  providers: [SocketService, SocketAdminGateway, SocketUserGateway]
})
export class SocketModule {}
