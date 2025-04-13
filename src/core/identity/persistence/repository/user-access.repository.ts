import { Nullable } from '@common/types/types';
import { UserAccess } from '@core/identity/entity/user-access.entity';
import { User } from '@core/identity/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, InsertResult, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';

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

  public async findUserAccess(by: {
    id?: string;
    userId?: string;
    email?: string;
    resetToken?: string;
    resetTokenExpiresIn?: Date;
  }): Promise<Nullable<UserAccess>> {
    const query: SelectQueryBuilder<UserAccess> = this.buildUserAccessQueryBuilder();
    this.extendQueryWithByProperties(query, by);

    return await query.getOne();
  }

  public async updateUserAccess(by: { id: string }, data: UserAccess): Promise<void> {
    const query: UpdateQueryBuilder<UserAccess> = this.entityManager.createQueryBuilder().update(UserAccess);

    query.andWhere(`id = :id`, { id: by.id });

    query.set({
      password: data.password,
      resetToken: data.resetToken,
      resetTokenExpiresIn: data.resetTokenExpiresIn,
      updatedAt: data.updatedAt,
    });

    await query.execute();
  }

  private buildUserAccessQueryBuilder(): SelectQueryBuilder<UserAccess> {
    return this.entityManager
      .createQueryBuilder(UserAccess, this.userAccessAlias)
      .select()
      .leftJoinAndMapOne(`${this.userAccessAlias}.user`, User, 'user', `${this.userAccessAlias}.user_id = user.id`);
  }

  private extendQueryWithByProperties(
    query: SelectQueryBuilder<UserAccess>,
    by?: { id?: string; userId?: string; email?: string; resetToken?: string; resetTokenExpiresIn?: Date },
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

    if (by?.resetToken) {
      query.andWhere(`"${this.userAccessAlias}"."reset_token" = :resetToken`, { resetToken: by.resetToken });
    }

    if (by?.resetTokenExpiresIn) {
      query.andWhere(`"${this.userAccessAlias}"."reset_token_expires_in" >= :resetTokenExpiresIn`, {
        resetTokenExpiresIn: by?.resetTokenExpiresIn,
      });
    }
  }
}
