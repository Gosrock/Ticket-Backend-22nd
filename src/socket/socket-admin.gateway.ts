import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TicketEntryResponseDto } from 'src/common/dtos/ticket-entry-response.dto';
import { SocketGuard } from '../auth/guards/Socket.guard';

@UseGuards(SocketGuard)
@Roles(Role.Admin)
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
  @WebSocketServer() public io: Namespace;

  //유저의 입장 확인 이벤트
  @SubscribeMessage('enter')
  handleRequest(
    @ConnectedSocket() adminSocket: Socket,
    //@MessageBody() ticketEntryResponseDto: TicketEntryResponseDto
  ) {
    adminSocket.emit('enter', '소켓 서버에 연결되었습니다');
  }

  //interface 구현부

  afterInit(server: Server) {
    this.logger.log('SocketAdminGateway Init');
  }

  @UseGuards(SocketGuard)
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id} connected`);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id} disconnected`);
  }
}
