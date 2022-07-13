import { Injectable } from '@nestjs/common';
import { throwIfEmpty } from 'rxjs';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private redisSerivce: RedisService
  ) {}

  async getAllUsers(): Promise<User[]> {
    // auto 시리얼 라이징
    const user = await this.userRepository.findAll();
    await this.redisSerivce.setWithTTLValidationNumber('asdfasdf', '0000', 30);
    return user;
  }

  async saveUser(): Promise<User> {
    const user = new User();
    user.phoneNumber = '010';
    user.name = '찬지니';
    console.log(await this.redisSerivce.getByKeyValidationNumber('asdfasdf'));

    return await this.userRepository.saveUser(user);
  }
}
