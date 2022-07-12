import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockType } from 'src/common/funcs/mockType';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthService } from './auth.service';

export const repositoryMockFactory: () => MockType<UserRepository> = jest.fn(
  () => ({
    findAll: jest.fn(entity => entity)
    // ...
  })
);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [TypeOrmModule.forFeature([User])],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useFactory: repositoryMockFactory
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
