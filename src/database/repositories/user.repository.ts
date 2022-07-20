import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/consts/enum';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    console.log('phoneNumber', phoneNumber);
    let users;
    try {
      users = await this.userRepository.findOne({
        where: {
          phoneNumber: phoneNumber
        }
      });
    } catch (error) {
      console.log(error);
    }

    return users;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async saveUser(user: User) {
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: id
      }
    });
  }

  //유저 롤 변경하는 테스트용 함수입니다
  async changeRole(userId: number, role: Role): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    });

    if (user) user.role = role;
    else throw new NotFoundException('user not found');

    await this.userRepository.save(user);
    return user;
  }
  //유저 롤 변경하는 테스트용 함수입니다
}
