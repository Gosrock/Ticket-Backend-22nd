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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test', 'provision')
          .default('dev'),
        PORT: Joi.number().default(8080),
        JWT_SECRET: Joi.string(),
        SWAGGER_USER: Joi.string(),
        SWAGGER_PASSWORD: Joi.string(),
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.number()
      })
    }),
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
    RedisModule,
    QueueModule,
    AuthModule,
    TicketsModule,
    OrdersModule,
    SlackModule,
    SocketModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
