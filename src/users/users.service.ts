import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userRepository.findByPhoneNumber(phoneNumber);
  }
}
