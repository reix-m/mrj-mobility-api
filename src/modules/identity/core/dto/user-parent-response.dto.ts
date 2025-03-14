import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserParentResponseDto {
  @Expose()
  public id: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;
}
