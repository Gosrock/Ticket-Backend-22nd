import { Inject, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RedisModule } from 'src/redis/redis.module';
import { SlackModule } from 'src/slack/slack.module';
import { SmsModule } from 'src/sms/sms.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/AccessToken.guard';
import { RegisterTokenGuard } from './guards/RegisterToken.guard';

@Module({
  imports: [
    SmsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isProd: configService.get('NODE_ENV') === 'prod' ? true : false
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    TypeOrmModule.forFeature([User]),
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
  controllers: [AuthController],
  providers: [
    {
      provide: Logger,
      useValue: new Logger('authService')
    },
    UserRepository,
    AuthService,
    UsersService,
    RegisterTokenGuard,
    AccessTokenGuard
  ],
  exports: [RegisterTokenGuard, AccessTokenGuard, AuthService]
})
export class AuthModule {}
