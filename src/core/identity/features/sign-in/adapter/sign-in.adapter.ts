import { ServiceValidatableAdapter } from '@common/adapter/service-validatable-adapter';
import { ClassValidatorMessages } from '@common/class-validator/class-validator-messages';
import { SignInPort } from '@core/identity/features/sign-in/port/sign-in.port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail } from 'class-validator';

@Exclude()
export class SignInAdapter extends ServiceValidatableAdapter implements SignInPort {
  @Expose()
  @IsEmail({}, { message: ClassValidatorMessages.IsEmal('email') })
  public email: string;

  @Expose()
  public password: string;

  public static async new(payload: SignInPort): Promise<SignInAdapter> {
    const adapter: SignInAdapter = plainToInstance(SignInAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}
