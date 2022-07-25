import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { TicketStatus } from 'src/common/consts/enum';
import { TicketOnSocketDto } from 'src/common/dtos/ticket-on-socket.dto';
import { SocketGuard } from '../auth/guards/Socket.guard';

@UseGuards(SocketGuard)
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
  private isAlreadyConnteced = false;
  @WebSocketServer() public io: Namespace;

  //유저 입장 (QR 코드 띄운 상태)
  @SubscribeMessage('enter')
  handleEntering(
    @ConnectedSocket() userSocket: Socket,
    @MessageBody() ticketOnSocketDto: TicketOnSocketDto
  ) {
    const { uuid } = ticketOnSocketDto;
    if (!uuid) throw new NotFoundException('uuid non-exist');

    this.logger.log(`${uuid} 입장 대기 중입니다`);

    //해당 uuid 에 대한 소켓 listening
    userSocket.join(uuid);
  }
  //interface 구현부

  afterInit(server: Server) {
    this.logger.log('SocketUserGateway Init');
  }
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id} connected`);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id} disconnected`);
  }
}
