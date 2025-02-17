import { Nullable } from '@src/common/types/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_accesses')
export class UserAccess {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public password: string;

  @Column({ name: 'user_id' })
  public userId: string;

  @Column({ name: 'last_login', type: 'timestamp' })
  public lastLogin: Nullable<Date>;

  @Column({ name: 'created_at' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  public updatedAt: Nullable<Date>;

  public user: Nullable<{
    id: string;
    email: string;
  }>;

  constructor(data: Partial<UserAccess>) {
    Object.assign(this, data);

    this.createdAt = data?.createdAt ?? new Date();
    this.lastLogin = data?.lastLogin ?? null;
    this.updatedAt = data?.updatedAt ?? null;
    this.user = data?.user ?? null;
  }

  public static new(data: Partial<UserAccess>): UserAccess {
    return new UserAccess(data);
  }
}
