import { Injectable, Logger } from '@nestjs/common';
import { Role } from 'src/common/consts/enum';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userRepository.findByPhoneNumber(phoneNumber);
  }

  async testGetUser(user: User) {
    Logger.log(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findUserById(id);
  }

  //유저 롤 변경하는 테스트용 함수입니다
  async changeRole(userId: number, role: Role): Promise<User | null> {
    return await this.userRepository.changeRole(userId, role);
  }
  //유저 롤 변경하는 테스트용 함수입니다
}
