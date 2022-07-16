import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/common/dtos/create-ticket.dto';
import { Order } from 'src/database/entities/order.entity';
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

  /**
   * 티켓을 생성한다
   * @param createTicketDto 티켓 생성 dto
   * @param order 티켓이 속한 주문
   * @param user 티켓을 소유한 유저
   */
  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket | null> {
    return await this.ticketRepository.createTicket(createTicketDto);
  }
}
