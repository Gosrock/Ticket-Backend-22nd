import { GatewayTimeoutException, Injectable } from '@nestjs/common';
import { TicketOnSocketDto } from 'src/common/dtos/ticket-on-socket.dto';
import { SocketUserGateway } from './socket-user.gateway';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private userGateway: SocketUserGateway) {}

  async connect(ticketOnSocketDto: TicketOnSocketDto) {
    try {
      this.userGateway.io.emit('enter', ticketOnSocketDto);
    } catch (error) {
      console.log(error);
      throw new GatewayTimeoutException('소켓 서버에 연결할 수 없습니다');
    }

    console.log(`SocketService:: connect to ${ticketOnSocketDto.uuid}`);
  }
}
