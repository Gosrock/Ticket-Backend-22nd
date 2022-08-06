import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { Role, TicketStatus } from 'src/common/consts/enum';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { TicketEntryDateValidationDto } from 'src/tickets/dtos/ticket-entry-date-validation.dto copy';
import { getConnectedRepository } from 'src/common/funcs/getConnectedRepository';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { SocketService } from 'src/socket/socket.service';
import { QueueService } from 'src/queue/queue.service';
import { DataSource } from 'typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { TicketEntryResponseDto } from './dtos/ticket-entry-response.dto';
import { TicketFindDto } from './dtos/ticket-find.dto';
import { UpdateTicketStatusDto } from './dtos/update-ticket-status.dto';
import { AccessJwtPayload } from 'src/auth/auth.interface';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  constructor(
    private ticketRepository: TicketRepository,
    private socketService: SocketService,
    private dataSource: DataSource,
    private queueService: QueueService
  ) {}

  async findById(ticketId: number): Promise<Ticket | null> {
    return await this.ticketRepository.findById(ticketId);
  }

  /**
   * uuid를 참조하여 ticketRepository 의 findByUUid 호출
   * user.role === Role.Admin 이거나 User id가 일치할때만 리턴해줌
   * @param ticketUuid 가지고 오려는 Ticket의 uuid
   * @param user Request User
   * @returns Ticket Promise
   */
  async findByUuid(
    ticketUuid: string,
    user: AccessJwtPayload
  ): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findByUuid(ticketUuid);

    //어드민이거나 Ticket.user.id === user.id 일때만 리턴
    if (ticket.user.id !== user.id && user.role !== Role.Admin) {
      throw new UnauthorizedException('해당 티켓에 대한 접근 권한이 없습니다');
    }

    return ticket;
  }

  /**
   * socket용 find 메서드
   * @param ticketUuid 가지고 오려는 Ticket의 uuid
   * @returns Ticket Promise
   */
  async findByUuidSocket(ticketUuid: string): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findByUuid(ticketUuid);
    return ticket;
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }

  async findAllByUserId(userId: number): Promise<Ticket[]> {
    return await this.ticketRepository.findAllByUserId(userId);
  }

  async findAllByOrderId(orderId: number): Promise<Ticket[]> {
    return await this.ticketRepository.findAllByOrderId(orderId);
  }

  async findAllWith(
    ticketFindDto: TicketFindDto,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Ticket>> {
    return await this.ticketRepository.findAllWith(
      ticketFindDto,
      pageOptionsDto
    );
  }

  async countTicket(): Promise<number> {
    return await this.ticketRepository.countTicket();
  }

  /**
   * 어드민이 티켓을 찍었을때 연결할 url에서 검증을 완료한 후 소켓 메세지 전송
   * @param uuid TicketValidationDto -> uuid
   * @param admin 현재 로그인 중인 어드민
   */
  async entryValidation(
    ticketEntryDateValidationDto: TicketEntryDateValidationDto,
    uuid: string,
    admin: User
  ): Promise<TicketEntryResponseDto> {
    this.logger.log('TicketEntryValidation');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const connectedRepository = getConnectedRepository(
      TicketRepository,
      queryRunner,
      Ticket
    );

    try {
      const { date } = ticketEntryDateValidationDto;
      const ticket = await connectedRepository.findByUuid(uuid);
      const response = new TicketEntryResponseDto(ticket, admin.name, false);
      /** Enum 받아서 입장 실패 메세지 가져오는 람다식 */
      const getFailureMessage = (status: TicketStatus) => {
        if (status == TicketStatus.DONE) {
          return '이미 입장 완료된 티켓입니다';
        } else if (status == TicketStatus.EXPIRE) {
          return '입금 기한이 만료된 티켓입니다';
        } else if (status == TicketStatus.ORDERWAIT) {
          return '입금 대기중인 티켓입니다';
        }
        return '검증 오류';
      };

      // 티켓 날짜 오류(공연 날짜가 일치하지 않음)
      if (ticket.date !== date) {
        response.message = '[입장실패] 공연 날짜가 일치하지 않습니다';
        this.socketService.emitToAll(response);
        throw new BadRequestException('공연 날짜가 일치하지 않습니다');
      }

      // 티켓 상태 오류('입장대기'가 아님)
      if (ticket.status !== TicketStatus.ENTERWAIT) {
        response.message = '[입장실패]' + getFailureMessage(ticket.status);
        this.socketService.emitToAll(response);
        throw new BadRequestException(getFailureMessage(ticket.status));
      }

      //성공 시
      ticket.status = TicketStatus.DONE;
      ticket.admin = admin;

      await connectedRepository.saveTicket(ticket);

      response.message = `[입장성공] ${ticket.user?.name}님이 입장하셨습니다`;
      response.success = true;
      this.logger.log(`${ticket.user?.name}님이 입장하셨습니다`);
      this.socketService.emitToAll(response);

      await queryRunner.commitTransaction();
      return response;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`티켓 상태 오류 - ${e.message}`);
      // 내부 예외 그대로 던짐
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 해당 ticketId를 참조하여 Ticket 엔티티의 status를 변경하고 DB에 저장한다
   * @param ticketId Ticket의 id
   * @param status 변경하고자 하려는 상태
   * @param admin 변경하려는 어드민 정보
   */
  async updateTicketStatus(
    updateTicketStatusDto: UpdateTicketStatusDto,
    admin: User
  ): Promise<Ticket> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const connectedRepository = getConnectedRepository(
      TicketRepository,
      queryRunner,
      Ticket
    );

    try {
      const { ticketId, status } = updateTicketStatusDto;
      const ticket = await connectedRepository.findById(ticketId);

      ticket.status = status;
      ticket.admin = admin;

      await connectedRepository.saveTicket(ticket);
      if (status == TicketStatus.DONE)
        await this.queueService.enterTicketStatusJob(ticket, admin);
      else await this.queueService.updateTicketStatusJob(ticket, admin, status);
      await queryRunner.commitTransaction();
      return ticket;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`티켓 status 변경 오류 - ${e.message}`);
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 티켓을 생성한다
   * @param createTicketDto 티켓 생성 dto
   */
  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket | null> {
    const result = await this.ticketRepository.createTicket(createTicketDto);
    return result;
  }

  async deleteTicketByUuid(ticketUuid: string): Promise<Ticket | null> {
    return await this.ticketRepository.deleteTicketByUuid(ticketUuid);
  }

  async deleteAllTickets(): Promise<void | null> {
    return await this.ticketRepository.deleteAllTickets();
  }
}
