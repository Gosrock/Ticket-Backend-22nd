import { GatewayTimeoutException, Injectable } from '@nestjs/common';
import { TicketEntryResponseDto } from 'src/tickets/dtos/ticket-entry-response.dto';
import { SocketAdminGateway } from './socket-admin.gateway';
import { SocketUserGateway } from './socket-user.gateway';

@Injectable()
export class SocketService {
  constructor(
    private userGateway: SocketUserGateway,
    private adminGateway: SocketAdminGateway
  ) {}

  async emitToUser(ticketEntryResponseDto: TicketEntryResponseDto) {
    try {
      const { uuid } = ticketEntryResponseDto;
      this.userGateway.io.emit(uuid, ticketEntryResponseDto);
    } catch (error) {
      console.log(error);
      throw new GatewayTimeoutException('소켓 서버에 연결할 수 없습니다');
    }

    console.log(`[SocketService]emit to user: ${ticketEntryResponseDto.uuid}`);
  }

  async emitToAdmin(ticketEntryResponseDto: TicketEntryResponseDto) {
    try {
      this.adminGateway.io.emit('enter', ticketEntryResponseDto);
    } catch (error) {
      console.log(error);
      throw new GatewayTimeoutException('소켓 서버에 연결할 수 없습니다');
    }

    console.log(`[SocketService]emit to admin: ${ticketEntryResponseDto.uuid}`);
  }
}
