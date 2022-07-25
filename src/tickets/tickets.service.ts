import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Role } from 'src/common/consts/enum';
import { CreateTicketDto } from 'src/common/dtos/create-ticket.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { TicketFindDto } from 'src/common/dtos/ticket-find.dto';
import { UpdateTicketStatusDto } from 'src/common/dtos/update-ticket-status.dto';
import { getConnectedRepository } from 'src/common/funcs/getConnectedRepository';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class TicketsService {
  constructor(
    private ticketRepository: TicketRepository,
    private dataSource: DataSource
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
  async findByUuid(ticketUuid: string, user: User): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findByUuid(ticketUuid);

    //어드민이거나 Ticket.user.id === user.id 일때만 리턴
    if (ticket.user.id !== user.id && user.role !== Role.Admin) {
      throw new UnauthorizedException('해등 티켓에 대한 접근 권한이 없습니다');
    }

    return ticket;
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }

  async findAllByUserId(userId: number): Promise<Ticket[]> {
    return await this.ticketRepository.findAllByUserId(userId);
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

      await queryRunner.commitTransaction();
      return ticket;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      //티켓 찾을때 Not Found Error 캐치
      if (e.status == 404) {
        throw new NotFoundException(e.response.message);
      }
      throw new InternalServerErrorException('Ticket db 에러');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 티켓을 생성한다
   * @param createTicketDto 티켓 생성 dto
   */
  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket | null> {
    return await this.ticketRepository.createTicket(createTicketDto);
  }

  async deleteTicketByUuid(ticketUuid: string): Promise<Ticket | null> {
    return await this.ticketRepository.deleteTicketByUuid(ticketUuid);
  }

  async deleteAllTickets(): Promise<void | null> {
    return await this.ticketRepository.deleteAllTickets();
  }
}
