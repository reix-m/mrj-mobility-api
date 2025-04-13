import { Nullable } from '@common/types/types';
import { User } from '@core/identity/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, InsertResult, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UserRepository {
  private readonly userAlias: string = 'user';

  private readonly excludeRemovedUserClause: string = `"${this.userAlias}"."removed_at" IS NULL`;

  private readonly entityManager: EntityManager;

  constructor(@InjectDataSource() dataSource: DataSource) {
    this.entityManager = dataSource.createEntityManager();
  }

  public async addUser(user: User): Promise<{ id: string }> {
    const insertResult: InsertResult = await this.entityManager
      .createQueryBuilder(User, this.userAlias)
      .insert()
      .into(User)
      .values(user)
      .execute();

    return { id: insertResult.identifiers[0].id };
  }

  public async findUser(
    by: {
      id?: string;
      email?: string;
    },
    options?: { includeRemoved?: boolean },
  ): Promise<Nullable<User>> {
    const query: SelectQueryBuilder<User> = this.buildUserQueryBuilder();
    this.extendQueryWithByProperties(query, by);

    if (!options?.includeRemoved) {
      query.andWhere(this.excludeRemovedUserClause);
    }

    return await query.getOne();
  }

  private buildUserQueryBuilder(): SelectQueryBuilder<User> {
    return this.entityManager
      .createQueryBuilder(User, this.userAlias)
      .select()
      .leftJoinAndMapOne(`${this.userAlias}.parent`, User, 'parent', `${this.userAlias}.parent_id = parent.id`);
  }

  private extendQueryWithByProperties(
    query: SelectQueryBuilder<User>,
    by?: { id?: string; parentId?: string; email?: string },
  ): void {
    if (by?.id) {
      query.andWhere(`"${this.userAlias}"."id" = :id`, { id: by.id });
    }

    if (by?.email) {
      query.andWhere(`"${this.userAlias}"."email" = :email`, {
        email: by.email,
      });
    }

    if (by?.parentId) {
      query.andWhere(`"${this.userAlias}"."parent_id" = :parentId`, {
        parentId: by.parentId,
      });
    }
  }
}
