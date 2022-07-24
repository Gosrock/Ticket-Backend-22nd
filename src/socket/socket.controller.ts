import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PerformanceDate, TicketStatus } from 'src/common/consts/enum';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/database/entities/user.entity';
import { SocketService } from './socket.service';

@ApiTags('socket')
@ApiBearerAuth('accessToken')
@Controller('socket')
//@UseGuards(AccessTokenGuard)
export class SocketController {
  constructor(private socketService: SocketService) {}

  @ApiOperation({
    summary: '[] 더미 컨트롤러 입니다'
  })
  @Get('')
  async connectTo(@ReqUser() user: User, ticketUuid: string) {
    const ticketDto = {
      uuid: 'abcdefg12345',
      date: PerformanceDate.YB,
      status: TicketStatus.WAIT
    };

    await this.socketService.connect(ticketDto);
  }
}
