import { NotFoundException } from '@nestjs/common';
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
import { TicketStatus } from 'src/common/consts/enum';
import { TicketOnSocketDto } from 'src/common/dtos/ticket-on-socket.dto';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: '/socket/user' //socket/admin or socket/user
})
export class SocketUserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public io: Namespace;

  //유저 입장 (QR 코드 띄운 상태)
  @SubscribeMessage('enter')
  handleEntering(
    @ConnectedSocket() userSocket: Socket,
    @MessageBody() ticketOnSocketDto: TicketOnSocketDto
  ) {
    const { uuid } = ticketOnSocketDto;
    if (!uuid) throw new NotFoundException('uuid non-exist');

    console.log(
      `WebSocketGateway::nsp: ${userSocket.nsp.name} 에서 입장 대기중 ${uuid}`
    );

    //해당 uuid 에 대한 소켓 listening
    userSocket.join(uuid);
  }
  //interface 구현부

  afterInit(server: Server) {
    console.log('SocketUserGateway Init');
  }
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connected', client.nsp.name);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnected', client.nsp.name);
  }
}
