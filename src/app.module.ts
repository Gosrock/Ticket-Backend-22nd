import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { OrdersModule } from './orders/orders.module';
import { SlackModule } from './slack/slack.module';
import { SocketModule } from './socket/socket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { BullModule } from '@nestjs/bull';
import { AllExceptionsFilter } from './common/exceptions/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { SmsModule } from './sms/sms.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomConfigModule } from './config/customConfig.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
          retryStrategy: times => {
            // check connection
            console.log('could not connect to redis!');
            process.exit(1);
          }
        }
      }),
      inject: [ConfigService]
    }),
    QueueModule,
    AuthModule,
    TicketsModule,
    OrdersModule,
    SlackModule,
    SocketModule,
    DatabaseModule.forRoot({ isTest: false }),
    UsersModule,
    SmsModule,
    ThrottlerModule.forRoot({
      ttl: process.env.NODE_ENV === 'prod' ? 300 : 60,
      limit: 3
    }),
    CustomConfigModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isTest: false,
        logging: false,
        redisConnectOption: {
          url:
            'redis://' +
            configService.get('REDIS_HOST') +
            ':' +
            configService.get('REDIS_PORT')
        }
      }),
      inject: [ConfigService]
    })
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
  ]
})
export class AppModule {}
