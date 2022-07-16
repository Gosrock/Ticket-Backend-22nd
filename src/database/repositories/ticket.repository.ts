import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketStatus } from 'src/common/consts/enum';
import { CreateTicketDto } from 'src/common/dtos/create-ticket.dto';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';

import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>
  ) {}

  /**
   * id를 참조하여 DB의 Ticket 엔티티 하나를 가지고 온다
   * @param ticketId 가지고 오려는 Ticket의 id
   */
  async findById(ticketId: number): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id: ticketId
      }
    });

    if (!ticket) {
      throw new NotFoundException(`Can't find Ticket with id ${ticketId}`);
    }
    return ticket;
  }

  /**
   * uuid를 참조하여 DB의 Ticket 엔티티 하나를 가지고 온다
   * @param ticketUuid 가지고 오려는 Ticket의 uuid
   */
  async findByUuid(ticketUuid: string): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        uuid: ticketUuid
      }
    });

    if (!ticket) {
      throw new NotFoundException(`Can't find Ticket with id ${ticketUuid}`);
    }
    return ticket;
  }

  // /**
  //  * DB의 Ticket 엔티티 전체를 가지고 온다 (관리자용 기능)
  //  * @param ticketId 가지고 오려는 Ticket의 id
  //  */
  // async findAll(take: number, page: number): Promise<Ticket[] | null> {
  //   const [tickets, total] = await this.ticketRepository.findAndCount({
  //     take: take,
  //     skip: take * (page - 1),
  //     order: { createdAt: 'DESC' }
  //   });

  //   if (!tickets) {
  //     throw new NotFoundException(`Can't find Tickets at all`);
  //   }
  //   return tickets;
  // }
  async findAll(): Promise<Ticket[] | null> {
    const tickets = await this.ticketRepository.find();

    if (!tickets) {
      throw new NotFoundException(`Can't find Tickets at all`);
    }
    return tickets;
  }

  /**
   * 해당 userId를 참조하여 유저가 가진 모든 Ticket 엔티티를 가지고 온다
   * @param userId User의 id
   */
  async findAllByUserId(userId: number): Promise<Ticket[] | null> {
    const tickets = await this.ticketRepository.find({
      where: {
        id: userId
      }
    });

    if (!tickets) {
      throw new NotFoundException(
        `Can't find Tickets belongs to id: ${userId}`
      );
    }
    return tickets;
  }

  /**
   * 해당 ticketStatus를 참조하여 해당하는 Ticket 엔티티를 가지고 온다 (관리자용)
   * @param ticketStatus User의 id
   */
  async findAllByStatus(ticketStatus: TicketStatus): Promise<Ticket[] | null> {
    const tickets = await this.ticketRepository.find({
      where: {
        status: ticketStatus
      }
    });

    if (!tickets) {
      throw new NotFoundException(
        `Can't find Tickets with status: ${ticketStatus}`
      );
    }
    return tickets;
  }

  /**
   * 해당 ticketId를 참조하여 Ticket 엔티티의 status를 변경하고 DB에 저장한다
   * @param ticketId Ticket의 id
   * @param status 변경하고자 하려는 상태
   * @param admin 변경하려는 어드민 정보
   */
  async updateStatus(
    ticketId: number,
    status: TicketStatus,
    admin: User
  ): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id: ticketId
      }
    });

    if (!ticket) {
      throw new NotFoundException(`Can't find Tickets with id: ${ticketId}`);
    }

    try {
      ticket.status = status;
      ticket.admin = admin;
      await this.ticketRepository.save(ticket);
    } catch (error) {
      console.log(`Error occurs in updateStatus: ${error}`);
    }

    return ticket;
  }

  /**
   * 티켓을 생성한다
   * @param createTicketDto 티켓 생성 dto
   * @param order 티켓이 속한 주문
   * @param user 티켓을 소유한 유저
   */
  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket | null> {
    const { user, order, date } = createTicketDto;

    //order = orderRepository.findOne(order)

    const ticket = this.ticketRepository.create({
      date,
      user,
      order,
      admin: null
    });

    await this.ticketRepository.save(ticket);
    return ticket;
  }
}
