import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async saveUser(user: User) {
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
