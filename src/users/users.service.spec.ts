import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'src/common/funcs/mockType';
import { UserRepository } from 'src/database/repositories/user.repository';
import { UsersService } from './users.service';

export const repositoryMockFactory: () => MockType<UserRepository> = jest.fn(
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
          useFactory: repositoryMockFactory
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
