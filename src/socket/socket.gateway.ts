// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer
// } from '@nestjs/websockets';
// import { Namespace, Server, Socket } from 'socket.io';
// import { TicketStatus } from 'src/common/consts/enum';
// import { TicketOnSocketDto } from 'src/common/dtos/ticket-on-socket.dto';

// @WebSocketGateway({
//   cors: {
//     origin: '*'
//   },
//   namespace: /^\/socket\/(admin|user)$/ //socket/admin or socket/user
// })
// export class SocketGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer() public io: Namespace;

//   @SubscribeMessage('enter')
//   handleEntering(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() ticketOnSocketDto: TicketOnSocketDto
//   ) {
//     const { uuid, date, status } = ticketOnSocketDto;
//     const userSocket = this.io.server.of('socket/user');
//     const adminSocket = this.io.server.of('socket/admin');

//     console.log(
//       `WebSocketGateway:: ticketUuid: ${uuid}가 소켓 서버 접속 및 입장시도, nsp: ${client.nsp.name}`
//     );

//     /*
//      * namespace => socket/user 일때 기능
//      */

//     client.join(uuid as string);

//     //입장 대기 상태가 아닌 경우 반려
//     if (status !== TicketStatus.WAIT) {
//       const failMessage = {
//         ticketUuid: uuid,
//         success: false,
//         message: '티켓 상태를 확인하세요'
//       };

//       userSocket.emit(uuid as string, failMessage);
//       adminSocket.emit('alert', failMessage);
//       return;
//     }

//     //상태 확인 이후 어드민, 유저에 입장 성공 알림
//     const successMessage = {
//       ticketUuid: uuid,
//       success: true,
//       message: '입장 완료'
//     };
//     //adminSocket.emit('alert', ret);
//     userSocket.emit(uuid as string, successMessage);
//     adminSocket.emit('alert', successMessage);
//   }

//   // @SubscribeMessage('confirm')
//   // handleAdminConfirm(
//   //   @ConnectedSocket() admin: Socket,
//   //   @MessageBody() ticketOnSocketDto: TicketOnSocketDto
//   // ) {

//   // }

//   //interface 구현부

//   afterInit(server: Server) {
//     console.log('web socket init');
//   }
//   handleConnection(@ConnectedSocket() client: Socket) {
//     console.log('connected', client.nsp.name);
//   }
//   handleDisconnect(@ConnectedSocket() client: Socket) {
//     console.log('disconnected', client.nsp.name);
//   }
// }
