import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {}
}
