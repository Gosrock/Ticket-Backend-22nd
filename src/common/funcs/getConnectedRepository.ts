import { EntityTarget, ObjectLiteral, QueryRunner, Repository } from 'typeorm';

/**
 * 동일한 커넥션을 가진 레포지토리를 반환하는 함수
 * 2022-07-14 이찬진
 * @param type 생성할 리포지토리 (네스트 리포지토리가 아닌 우리가 직접만든 리포지토리 패턴)
 * @param queryRunner 커넥션과 트랜잭션을 시작한 쿼리 러너
 * @param entity 엔티티
 * @returns 동일한 트랜잭션을 가진 리포지토리 반환
 */
export function getConnectedRepository<T>(
  type: { new (repository: Repository<ObjectLiteral>): T },
  queryRunner: QueryRunner,
  entity: EntityTarget<ObjectLiteral>
): T {
  const userRepositoryFromDataSource =
    queryRunner.manager.getRepository(entity);
  // 의존성 주입을 해 커넥션이 동일한 레포지토리를 가져옴
  return new type(userRepositoryFromDataSource);
}

// // 땡겨온 커넥션으로 유저 레포지토리를 받아옴 하지만 우리는 repository 패턴을 쓰므로 ( 따로 뺌으로 )
// const userRepositoryFromDataSource =
// queryRunner.manager.getRepository(User);
// // 의존성 주입을 해 커넥션이 동일한 레포지토리를 가져옴
// const connectedUserRepository = new UserRepository(
// userRepositoryFromDataSource
// );
