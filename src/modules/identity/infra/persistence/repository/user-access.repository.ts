import { UserAccess } from '@modules/identity/infra/persistence/entity/user-access.entity';
import { User } from '@modules/identity/infra/persistence/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Nullable } from '@src/common/types/types';
import { DataSource, EntityManager, InsertResult, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UserAccessRepository {
  private readonly entityManager: EntityManager;

  private readonly userAccessAlias: string = 'userAccess';

  constructor(@InjectDataSource() dataSource: DataSource) {
    this.entityManager = dataSource.createEntityManager();
  }

  public async addUserAccess(userAccess: UserAccess): Promise<{ id: string }> {
    const insertResult: InsertResult = await this.entityManager
      .createQueryBuilder(UserAccess, this.userAccessAlias)
      .insert()
      .into(UserAccess)
      .values(userAccess)
      .execute();

    return { id: insertResult.identifiers[0].id };
  }

  public async findUserAccess(by: { id?: string; userId?: string; email?: string }): Promise<Nullable<UserAccess>> {
    const query: SelectQueryBuilder<UserAccess> = this.buildUserAccessQueryBuilder();
    this.extendQueryWithByProperties(query, by);

    return await query.getOne();
  }

  private buildUserAccessQueryBuilder(): SelectQueryBuilder<UserAccess> {
    return this.entityManager
      .createQueryBuilder(UserAccess, this.userAccessAlias)
      .select()
      .leftJoinAndMapOne(`${this.userAccessAlias}.user`, User, 'user', `${this.userAccessAlias}.user_id = user.id`);
  }

  private extendQueryWithByProperties(
    query: SelectQueryBuilder<UserAccess>,
    by?: { id?: string; userId?: string; email?: string },
  ): void {
    if (by?.id) {
      query.andWhere(`"${this.userAccessAlias}"."id" = :id`, { id: by.id });
    }

    if (by?.userId) {
      query.andWhere(`"${this.userAccessAlias}"."user_id" = :userId`, { userId: by.userId });
    }

    if (by?.email) {
      query.andWhere(`"user"."email" = :email`, { email: by.email });
    }
  }
}
