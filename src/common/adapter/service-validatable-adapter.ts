import { ClassValidationDetails, ClassValidator } from '@common/class-validator/class-validator';
import { Exception } from '@common/exception/exception';
import { Optional } from '@common/types/types';
import { HttpStatus } from '@nestjs/common';

export class ServiceValidatableAdapter {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Não foi possível processar a solicitação.',
        data: details,
      });
    }
  }
}
