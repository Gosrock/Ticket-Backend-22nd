import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/consts/enum';
import { PageMetaDto } from 'src/common/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { PagingDto } from 'src/common/dtos/paging.dto';
import { CreateTicketDto } from 'src/tickets/dtos/create-ticket.dto';
import { TicketFindDto } from 'src/tickets/dtos/ticket-find.dto';

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
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.order', 'order')
      .getMany();
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
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .where({ user: userId })
      .getMany();
  }

  /**
   *
   * @param orderId 조회할 주문id
   * @returns 해당 주문에 속한 Ticket 배열
   */
  async findAllByOrderId(orderId: number): Promise<Ticket[]> {
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .where({ order: orderId - 10000 })
      .getMany();
  }

  /**
   * 해당 티켓을 저장한다
   * @param ticket 저장할 티켓
   */
  async saveTicket(ticket: Ticket): Promise<Ticket> {
    const savedTicket = await this.ticketRepository.save(ticket);
    return savedTicket;
  }

  /**
   * 티켓을 생성한다
   * @param createTicketDto 티켓 생성 dto
   * @param order 티켓이 속한 주문
   * @param user 티켓을 소유한 유저
   */
  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { user, order, date } = createTicketDto;

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
