import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { OrderRepository } from 'src/database/repositories/order.repository';
import { QueueModule } from 'src/queue/queue.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TicketsModule,
    QueueModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository]
})
export class OrdersModule {}
