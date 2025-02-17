import { UserParent } from '@modules/identity/core/type/user-parent';
import { Nullable } from '@src/common/types/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
    name: 'first_name',
  })
  public firstName: string;

  @Column({
    name: 'last_name',
  })
  public lastName: string;

  @Column()
  public email: string;

  @Column({
    name: 'parent_id',
    type: 'uuid',
  })
  public parentId: Nullable<string>;

  @Column({
    name: 'created_at',
  })
  public createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
  })
  public updatedAt: Nullable<Date>;

  @Column({
    name: 'removed_at',
    type: 'timestamp',
  })
  public removedAt: Nullable<Date>;

  public parent?: Nullable<UserParent>;

  constructor(data: Partial<User>) {
    Object.assign(this, data);

    this.createdAt = data?.createdAt ?? new Date();
    this.updatedAt = data?.updatedAt ?? null;
    this.parentId = data?.parentId ?? null;
    this.parent = data?.parent ?? null;
    this.removedAt = data?.removedAt ?? null;
  }

  public static new(data: Partial<User>): User {
    return new User(data);
  }
}
