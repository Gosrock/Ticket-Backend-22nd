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
  namespace: '/socket/admin' //socket/admin or socket/user
})
export class SocketAdminGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public io: Namespace;

  //유저의 입장 확인 이벤트
  @SubscribeMessage('enter')
  handleRequest(
    @ConnectedSocket() adminSocket: Socket,
    @MessageBody() ticketOnSocketDto: TicketOnSocketDto
  ) {
    //QR 코드에 ticket dto 정보가 담겨져 있을거라고 예상하고 구현했습니다
    const { uuid, date, status } = ticketOnSocketDto;
    if (!uuid) throw new NotFoundException('uuid not found');

    const userSocket = this.io.server.of('socket/user');

    //입장 대기 상태가 아닌 경우 반려
    if (status !== TicketStatus.WAIT) {
      const failMessage = {
        ticketUuid: uuid,
        success: false,
        message: '티켓 상태를 확인하세요'
      };

      userSocket.emit(uuid, failMessage);
      adminSocket.emit('alert', failMessage);
      return;
    }

    //상태 확인 이후 어드민, 유저에 입장 성공 알림
    const successMessage = {
      ticketUuid: uuid,
      success: true,
      message: '입장 완료'
    };
    userSocket.emit(uuid, successMessage);
    adminSocket.emit('alert', successMessage);
  }

  //interface 구현부

  afterInit(server: Server) {
    console.log('SocketAdminGateway Init');
  }
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connected', client.nsp.name);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnected', client.nsp.name);
  }
}
