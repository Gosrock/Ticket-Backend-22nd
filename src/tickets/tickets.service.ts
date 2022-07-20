import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/common/consts/enum';
import { CreateTicketDto } from 'src/common/dtos/create-ticket.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { TicketFindDto } from 'src/common/dtos/ticket-find.dto';
import { UpdateTicketStatusDto } from 'src/common/dtos/update-ticket-status.dto';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class TicketsService {
  constructor(private ticketRepository: TicketRepository) {}

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
    if (user.role !== Role.Admin && ticket?.user?.id !== user.id) {
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

  async updateTicketStatus(
    updateTicketStatusDto: UpdateTicketStatusDto,
    admin: User
  ): Promise<Ticket> {
    return await this.ticketRepository.updateStatus(
      updateTicketStatusDto,
      admin
    );
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
