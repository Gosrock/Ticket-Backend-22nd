import {
  forwardRef,
  GatewayTimeoutException,
  Inject,
  Injectable
} from '@nestjs/common';
import { TicketEntryResponseDto } from 'src/tickets/dtos/ticket-entry-response.dto';
import { SocketAdminGateway } from './socket-admin.gateway';
import { SocketUserGateway } from './socket-user.gateway';

@Injectable()
export class SocketService {
  constructor(
    @Inject(forwardRef(() => SocketUserGateway))
    private userGateway: SocketUserGateway,
    @Inject(forwardRef(() => SocketAdminGateway))
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
  }

  async emitToAdmin(ticketEntryResponseDto: TicketEntryResponseDto) {
    try {
      this.adminGateway.io.emit('enter', ticketEntryResponseDto);
    } catch (error) {
      console.log(error);
      throw new GatewayTimeoutException('소켓 서버에 연결할 수 없습니다');
    }
  }

  //양쪽
  async emitToAll(ticketEntryResponseDto: TicketEntryResponseDto) {
    await this.emitToUser(ticketEntryResponseDto);
    await this.emitToAdmin(ticketEntryResponseDto);
  }
}
