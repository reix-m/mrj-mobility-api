import { SignUpPort } from '@modules/identity/core/features/sign-up/port/sign-up.port';
import { ServiceValidatableAdapter } from '@src/common/adapter/service-validatable-adapter';
import { ClassValidatorMessages } from '@src/common/class-validator/class-validator-messages';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

@Exclude()
export class SignUpAdapter extends ServiceValidatableAdapter implements SignUpPort {
  @Expose()
  @IsString({ message: ClassValidatorMessages.IsString('primeiro nome') })
  @Length(1, 100, { message: ClassValidatorMessages.Length('primeiro nome', 1, 100) })
  public firstName: string;

  @Expose()
  @IsString({ message: ClassValidatorMessages.IsString('sobrenome') })
  @Length(1, 100, { message: ClassValidatorMessages.Length('sobrenome', 1, 100) })
  public lastName: string;

  @Expose()
  @IsEmail({}, { message: ClassValidatorMessages.IsEmal('email') })
  public email: string;

  @Expose()
  @IsString({ message: ClassValidatorMessages.IsString('senha') })
  @Length(8, 32, { message: ClassValidatorMessages.Length('senha', 1, 32) })
  public password: string;

  public static async new(payload: SignUpPort): Promise<SignUpAdapter> {
    const adapter: SignUpAdapter = plainToInstance(SignUpAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}
