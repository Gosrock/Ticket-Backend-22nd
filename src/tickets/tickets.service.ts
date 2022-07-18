import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from 'src/common/dtos/create-ticket.dto';
import { FindTicketDto } from 'src/common/dtos/find-ticket.dto';
import { UpdateTicketStatusDto } from 'src/common/dtos/update-ticket-status.dto';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketRepository } from 'src/database/repositories/ticket.repository';

@Injectable()
export class TicketsService {
  constructor(private ticketRepository: TicketRepository) {}

  async findById(ticketId: number): Promise<Ticket | null> {
    return await this.ticketRepository.findById(ticketId);
  }

  async findByUuid(ticketUuid: string): Promise<Ticket | null> {
    return await this.ticketRepository.findByUuid(ticketUuid);
  }

  async findAll(): Promise<Ticket[] | null> {
    return await this.ticketRepository.findAll();
  }

  async findAllByUserId(userId: number): Promise<Ticket[] | null> {
    return await this.ticketRepository.findAllByUserId(userId);
  }

  async findAllWith(findTicketDto: FindTicketDto): Promise<Ticket[] | null> {
    return await this.ticketRepository.findAllWith(findTicketDto);
  }

  async updateTicketStatus(
    updateTicketStatusDto: UpdateTicketStatusDto,
    admin: User
  ): Promise<Ticket | null> {
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
