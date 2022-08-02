import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'src/common/funcs/mockType';
import { CommentRepository } from 'src/database/repositories/comment.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { UsersService } from './users.service';

const UserRepositoryMockFactory: () => MockType<UserRepository> = jest.fn(
  () => ({
    findAll: jest.fn(entity => entity)
    // ...
  })
);
const CommentRepositoryMockFactory: () => MockType<UserRepository> = jest.fn(
  () => ({
    findAll: jest.fn(entity => entity)
    // ...
  })
);
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: UserRepositoryMockFactory
        },
        {
          provide: CommentRepository,
          useFactory: CommentRepositoryMockFactory
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
