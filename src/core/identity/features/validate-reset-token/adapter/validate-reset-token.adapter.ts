import { ServiceValidatableAdapter } from '@common/adapter/service-validatable-adapter';
import { ClassValidatorMessages } from '@common/class-validator/class-validator-messages';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ValidateResetTokenAdapter extends ServiceValidatableAdapter {
  @Expose()
  @IsString({ message: ClassValidatorMessages.IsString('token') })
  public token: string;

  public static async new(payload: { token: string }): Promise<ValidateResetTokenAdapter> {
    const adapter: ValidateResetTokenAdapter = plainToInstance(ValidateResetTokenAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}
