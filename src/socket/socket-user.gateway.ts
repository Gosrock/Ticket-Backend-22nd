import {
  forwardRef,
  Inject,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { TicketsService } from 'src/tickets/tickets.service';

// @UseGuards(SocketGuard)
@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: '/socket/user' //socket/admin or socket/user
})
export class SocketUserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketUserGateway.name);
  constructor(
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService
  ) {}
  @WebSocketServer() public io: Namespace;

  //interface 구현부

  afterInit(server: Server) {
    this.logger.log('SocketUserGateway Init');
  }

  //티켓 uuid로 존재하는 티켓인지 검사 후 연결
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const ticketUuid =
        process.env.NODE_ENV == 'dev'
          ? client.handshake.headers.authorization
          : client.handshake.auth?.ticketUuid;

      if (!ticketUuid) {
        throw new UnauthorizedException('잘못된 헤더 요청');
      }

      const ticket = await this.ticketsService.findByUuidSocket(ticketUuid);
      if (!ticket) {
        throw new UnauthorizedException('없는 유저입니다.');
      }
      this.logger.log(`${client.id} connected`);

      //room: uuid로 강제 연결
      client.join(ticketUuid);
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
