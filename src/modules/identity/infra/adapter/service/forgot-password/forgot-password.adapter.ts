import { ForgotPasswordPort } from '@modules/identity/core/features/forgot-password/port/forgot-password.port';
import { ServiceValidatableAdapter } from '@src/common/adapter/service-validatable-adapter';
import { ClassValidatorMessages } from '@src/common/class-validator/class-validator-messages';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail } from 'class-validator';

@Exclude()
export class ForgotPasswordAdapter extends ServiceValidatableAdapter implements ForgotPasswordPort {
  @Expose()
  @IsEmail({}, { message: ClassValidatorMessages.IsEmal('email') })
  public email: string;

  public static async new(payload: ForgotPasswordPort): Promise<ForgotPasswordAdapter> {
    const adapter: ForgotPasswordAdapter = plainToInstance(ForgotPasswordAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}
