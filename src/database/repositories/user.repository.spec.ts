import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { DatabaseModule } from '../database.module';
import { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';

describe('userRepository Test ( Actual db )', () => {
  let userRepository: UserRepository;
  let dataBaseModule: TestingModule;
  let repositoryModule: TestingModule;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let userRepositoryFromDataSource: Repository<User>;

  beforeAll(async () => {
    dataBaseModule = await Test.createTestingModule({
      imports: [
        DatabaseModule.forRoot({ isTest: true }),
        TypeOrmModule.forFeature([User])
      ]
      // providers: [UserRepository]
    }).compile();

    // userRepository = dataBaseModule.get<UserRepository>(UserRepository);
    dataSource = dataBaseModule.get<DataSource>(getDataSourceToken());
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    userRepositoryFromDataSource = queryRunner.manager.getRepository(User);

    repositoryModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: UserRepository,
          useValue: new UserRepository(userRepositoryFromDataSource)
        }
      ]
    }).compile();
    userRepository = repositoryModule.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    //console.log('beforeEach');
    await queryRunner.startTransaction();
    // //console.log('start transaction', queryRunner.connection.driver);
  });

  afterEach(async () => {
    //console.log('afterEach');

    await queryRunner.rollbackTransaction();
    // //console.log('start transaction', queryRunner.connection.driver);
  });

  afterAll(async () => {
    //console.log('afterAll');

    await queryRunner.release();
    await dataBaseModule.close();
    await repositoryModule.close();
  });

  // it('should be defined', async () => {
  //   const users = await userRepository.findAll();
  //   expect(users).resolves.toHaveLength(1);
  //   return;
  // });

  it('input test', async () => {
    const user = new User();
    user.name = 'asdfasdfasc222';
    user.phoneNumber = '123123123213123';
    if (queryRunner) {
      //console.log(queryRunner.isTransactionActive);
    }

    await userRepository.saveUser(user);
    const users = await userRepository.findAll();
    //console.log(users);
    // expect(users).resolves.toHaveLength(1);
    return;
  });
});

// let app: INestApplication;
// let testModule: TestingModule;

// afterEach(async () => {
//   const em: EntityManager = testModule.get(getEntityManagerToken('default'));
//   await em.queryRunner.rollbackTransaction();
// });

// beforeEach(async () => {
//   const con: Connection = testModule.get(Connection);
//   const em: EntityManager = testModule.get(getEntityManagerToken('default'));
//   const repo: CourseRepository = testModule.get(CourseRepository);
//   const result: boolean = repo.isEntityManagerMine(em); // false => the repo is not using the default entity manager
//   const conResult: boolean = repo.isConnectionMine(em.connection); // true => the repo is using the same connection
//   await em.queryRunner.startTransaction();
// });

// afterAll(async () => {
//   await app.close();
//   await testModule.close();
// });

// beforeAll(async () => {
//   testModule = await Test.createTestingModule({
//     imports: [AppModule]
//   })
//     .overrideProvider(getEntityManagerToken('default'))
//     .useFactory({
//       factory: (connection: Connection): EntityManager => {
//         const queryRunner: QueryRunner = connection.createQueryRunner('master');
//         const entityManager: EntityManager =
//           connection.createEntityManager(queryRunner);
//         return entityManager;
//       },
//       inject: [getConnectionToken('default')]
//     })
//     .compile();

//   app = testModule.createNestApplication();
//   await app.init();
// });
