import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SocketGuard } from './socket.guard';

// @UseGuards(SocketGuard)
// @Roles(Role.Admin)
@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: '/socket/admin' //socket/admin or socket/user
})
export class SocketAdminGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketAdminGateway.name);
  constructor(private authService: AuthService) {}

  @WebSocketServer() public io: Namespace;

  //interface 구현부

  afterInit(server: Server) {
    // remove the namespace
    this.io.server._nsps.delete('/');
    this.logger.log('SocketAdminGateway Init');
  }

  //소켓 헤더에서 엑세스토큰 검사
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const accessToken =
        process.env.NODE_ENV == 'dev'
          ? client.handshake.headers.authorization
          : client.handshake.auth?.token;

      if (!accessToken) {
        throw new UnauthorizedException('잘못된 헤더 요청');
      }
      const payload = this.authService.verifyAccessJWT(accessToken);

      this.logger.log(`${client.id} connected`);
      const user = await this.authService.findUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException('없는 유저입니다.');
      }
      if (user.role !== Role.Admin) {
        throw new UnauthorizedException('권한이 없습니다');
      }
      this.logger.log(`${client.id} connected`);
    } catch (e) {
      this.logger.error(
        `${client.id} 연결 강제 종료, status: ${e.status}, ${e.message}`
      );
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id} disconnected`);
  }
}
