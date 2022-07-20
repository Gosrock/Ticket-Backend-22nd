import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/consts/enum';
import { CreateTicketDto } from 'src/common/dtos/create-ticket.dto';
import { PageMetaDto } from 'src/common/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { PagingDto } from 'src/common/dtos/paging.dto';
import { TicketFindDto } from 'src/common/dtos/ticket-find.dto';
import { UpdateTicketStatusDto } from 'src/common/dtos/update-ticket-status.dto';

import { Repository } from 'typeorm';
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
  async findById(ticketId: number): Promise<Ticket> {
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
   * @returns Ticket Promise
   */
  async findByUuid(ticketUuid: string): Promise<Ticket> {
    const ticket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where({ uuid: ticketUuid })
      .leftJoinAndSelect('ticket.user', 'user')
      .getOne();

    if (!ticket) {
      throw new NotFoundException(`Can't find Ticket with uuid ${ticketUuid}`);
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
  async findAll(): Promise<Ticket[]> {
    //const tickets = await this.ticketRepository.find();

    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.order', 'order')
      .getMany();

    if (tickets.length === 0) {
      throw new NotFoundException(`Can't find Tickets at all`);
    }
    return tickets;
  }

  /**
   * 해당 ticketStatus를 참조하여 해당하는 Ticket 엔티티를 가지고 온다 (관리자용)
   * @param ticketStatus TicketStatus Enum
   * @param pageOptionsDto 페이지네이션 메타 정보
   */
  async findAllWith(
    ticketFindDto: TicketFindDto,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Ticket>> {
    const { status, date } = ticketFindDto;
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket');

    //조건부 검색
    if (status) {
      queryBuilder.andWhere({ status });
    }
    if (date) {
      queryBuilder.andWhere({ date });
    }

    queryBuilder
      .orderBy('ticket.createdAt', pageOptionsDto.order)
      .leftJoin('ticket.user', 'user')
      .addSelect(['user.name', 'user.phoneNumber'])
      .leftJoin('ticket.admin', 'admin')
      .addSelect(['admin.name'])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    console.log(1);
    return new PageDto(entities, pageMetaDto);
  }

  /**
   * 해당 userId를 참조하여 유저가 가진 모든 Ticket 엔티티를 가지고 온다
   * @param userId User의 id
   */
  async findAllByUserId(userId: number): Promise<Ticket[]> {
    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where({ user: userId })
      .getMany();

    if (!tickets || tickets.length <= 0) {
      throw new NotFoundException(
        `Can't find Tickets belongs to id: ${userId}`
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
    updateTicketStatus: UpdateTicketStatusDto,
    admin: User
  ): Promise<Ticket> {
    const { ticketId, status } = updateTicketStatus;
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
  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { user, order, date } = createTicketDto;

    //order = orderRepository.findOne(order)

    const ticket = this.ticketRepository.create({
      date: date,
      user: user,
      order: order,
      admin: null
    });

    await this.ticketRepository.save(ticket);
    return ticket;
  }

  /**
   * 해당 id에 해당하는 티켓을 제거한다
   * @param ticketId 해당 티켓의 id
   * @returns 제거한 티켓 반환
   */
  async deleteTicketById(ticketId: number): Promise<Ticket | null> {
    const ticket = this.ticketRepository.findOne({
      where: {
        id: ticketId
      }
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket not found with id: ${ticketId}`);
    }

    const result = await this.ticketRepository.delete(ticketId);

    if (result.affected === 0) {
      throw new NotFoundException(`Ticket not found with id: ${ticketId}`);
    }

    return ticket;
  }

  /**
   * 해당 id에 해당하는 티켓을 제거한다
   * @param ticketId 해당 티켓의 id
   * @returns 제거한 티켓 반환
   */
  async deleteTicketByUuid(ticketUuid: string): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        uuid: ticketUuid
      }
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket not found with uuid: ${ticketUuid}`);
    }

    const result = await this.ticketRepository.delete(ticket.id);

    if (result.affected === 0) {
      throw new NotFoundException(`Ticket not found with id: ${ticket.id}`);
    }

    return ticket;
  }

  /**
   * 해당 id에 해당하는 티켓을 제거한다
   * @param ticketId 해당 티켓의 id
   * @returns 제거한 티켓 반환
   */
  async deleteAllTickets(): Promise<void> {
    await this.findAll().then(tickets => {
      tickets?.map(ticket => {
        this.deleteTicketById(ticket.id);
      });
    });
  }
}
