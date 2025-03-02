import { ClassValidatorMessages } from '@src/common/class-validator/class-validator-messages';
import { IsEmail } from 'class-validator';

export class ForgotPasswordPort {
  @IsEmail({}, { message: ClassValidatorMessages.IsEmal('email') })
  public email: string;
}
