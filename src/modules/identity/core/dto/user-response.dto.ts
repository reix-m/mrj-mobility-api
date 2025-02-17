import { UserParentResponseDto } from '@modules/identity/core/dto/user-parent-response.dto';
import { User } from '@modules/identity/infra/persistence/entity/user.entity';
import { Nullable } from '@src/common/types/types';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  public id: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public email: string;

  @Expose()
  @Type(() => UserParentResponseDto)
  public parent: Nullable<UserParentResponseDto>;

  public createdAt: number;

  public updatedAt: Nullable<number>;

  public static newFromUser(user: User): UserResponseDto {
    const dto: UserResponseDto = plainToInstance(UserResponseDto, user);

    dto.createdAt = user.createdAt.getTime();
    dto.updatedAt = user.updatedAt?.getTime() ?? null;

    return dto;
  }
}
