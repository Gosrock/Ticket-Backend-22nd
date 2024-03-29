import { Global, Inject, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Comment } from 'src/database/entities/comment.entity';
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

@Global()
@Module({
  imports: [
    SmsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // 데모 사이트를 위한 sms 모듈 fake 로설정
        isProd: false
        // isProd: configService.get('NODE_ENV') === 'prod' ? true : false
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    TypeOrmModule.forFeature([User])
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
