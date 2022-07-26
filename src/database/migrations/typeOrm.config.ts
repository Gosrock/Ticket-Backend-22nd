import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Ticket } from '../entities/ticket.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { TicketStatusAddEnum1658837628780 } from './1658837628780-TicketStatusAddEnum';

config();

const configService = new ConfigService();
console.log(configService.get('POSTGRES_HOST'));
export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  entities: [Ticket, Order, User, Comment],
  migrations: [TicketStatusAddEnum1658837628780]
});
