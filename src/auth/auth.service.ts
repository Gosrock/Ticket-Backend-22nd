import { Injectable } from '@nestjs/common';
import User from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    // auto 시리얼 라이징
    const user = await this.userRepository.findAll();

    return user;
  }

  async saveUser(): Promise<User> {
    const user = new User();
    user.phoneNumber = '010';
    user.name = '찬지니';

    return await this.userRepository.saveUser(user);
  }
}
