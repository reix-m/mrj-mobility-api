import { ServiceValidatableAdapter } from '@common/adapter/service-validatable-adapter';
import { ClassValidatorMessages } from '@common/class-validator/class-validator-messages';
import { ResetPasswordPort } from '@core/identity/features/reset-password/port/reset-password.port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@Exclude()
export class ResetPasswordAdapter extends ServiceValidatableAdapter implements ResetPasswordPort {
  @Expose()
  @IsString({ message: ClassValidatorMessages.IsString('token') })
  public token: string;

  @Expose()
  @IsString({ message: ClassValidatorMessages.IsString('senha') })
  @Length(8, 32, { message: ClassValidatorMessages.Length('senha', 1, 32) })
  public password: string;

  public static async new(payload: ResetPasswordPort): Promise<ResetPasswordAdapter> {
    const adapter: ResetPasswordAdapter = plainToInstance(ResetPasswordAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}
