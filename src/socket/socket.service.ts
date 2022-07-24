import { GatewayTimeoutException, Injectable } from '@nestjs/common';
import { TicketOnSocketDto } from 'src/common/dtos/ticket-on-socket.dto';
import { SocketAdminGateway } from './socket-admin.gateway';

@Injectable()
export class SocketService {
  constructor(private socketAdminGateway: SocketAdminGateway) {}

  async connect(ticketOnSocketDto: TicketOnSocketDto) {
    try {
      this.socketAdminGateway.server.emit('ticket', ticketOnSocketDto);
    } catch (error) {
      console.log(error);
      throw new GatewayTimeoutException('소켓 서버에 연결할 수 없습니다');
    }

    console.log(`SocketService:: connect to ${ticketOnSocketDto.uuid}`);
  }
}
