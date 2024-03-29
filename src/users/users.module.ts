import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { CommentRepository } from 'src/database/repositories/comment.repository';
import { Comment } from 'src/database/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Comment]),
    forwardRef(() => AuthModule)
  ],
  providers: [UsersService, UserRepository, CommentRepository],
  exports: [UsersService, CommentRepository],
  controllers: [UsersController]
})
export class UsersModule {}
