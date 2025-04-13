import { ServiceValidatableAdapter } from '@common/adapter/service-validatable-adapter';
import { ClassValidatorMessages } from '@common/class-validator/class-validator-messages';
import { ForgotPasswordPort } from '@core/identity/features/forgot-password/port/forgot-password.port';
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
