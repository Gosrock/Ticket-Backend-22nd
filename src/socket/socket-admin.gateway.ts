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
import { Server, Socket } from 'socket.io';
import { TicketStatus } from 'src/common/consts/enum';
import { TicketOnSocketDto } from 'src/common/dtos/ticket-on-socket.dto';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'socketserver' ///\/socketserver-.+/
})
export class SocketAdminGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage('enter')
  handleEntering(
    @ConnectedSocket() socket: Socket,
    @MessageBody() ticketOnSocketDto: TicketOnSocketDto
  ) {
    const { uuid, date, status } = ticketOnSocketDto;
    // const userSocket = this.server.of('/socket/user');
    // const adminSocket = this.server.of('/socket/admin');

    console.log(`WebSocketGateway:: ticketUuid: ${uuid} 가 소켓 서버 접속`);
    socket.join(uuid as string);

    //입장 대기 상태가 아닌 경우 반려
    if (status !== TicketStatus.WAIT) {
      socket.emit('alert', {
        ticketUuid: uuid,
        success: false,
        message: '티켓 상태를 확인하세요'
      });
      return;
    }

    //상태 확인 이후 어드민, 유저에 입장 성공 알림
    const ret = {
      ticketUuid: uuid,
      success: true,
      message: '입장 완료'
    };

    socket.emit('alert', ret);
  }

  //interface 구현부

  afterInit(server: Server) {
    console.log('web socket init');
  }
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connected', client.nsp.name);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnected', client.nsp.name);
  }
}
