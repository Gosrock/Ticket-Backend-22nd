import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RequestUserNameDto } from 'src/users/dtos/UserName.request.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageMetaDto } from 'src/common/dtos/page/page-meta.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { plainToInstance } from 'class-transformer';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getMyInfo(user: User) {
    return await this.userRepository.findOne({ where : {id: user.id}});
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    //console.log('phoneNumber', phoneNumber);
    let users;
    try {
      users = await this.userRepository.findOne({
        where: {
          phoneNumber: phoneNumber
        }
      });
    } catch (error) {
      //console.log(error);
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

  // 유저 정보 조회(관리자용) 전체 정보 조회
  async getAllUserInfo(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .orderBy('user.createdAt', pageOptionsDto.order)
      .leftJoin('user.ticket', 'ticket')
      .addSelect('ticket')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto })
    
    return new PageDto(entities, pageMetaDto);    
  }

  // 입금자명 수정
  async changeName(id: number, requestUserNameDto: RequestUserNameDto) {
    const found = await this.userRepository.findOne({ where: {id: id}});

    if (!found) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    const { name } = requestUserNameDto;

    found.name = name;

    await this.userRepository.save(found);
    return plainToInstance(UserProfileDto, found);
  }

}