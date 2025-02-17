import { HttpStatus } from '@nestjs/common';
import { ClassValidationDetails, ClassValidator } from '@src/common/class-validator/class-validator';
import { Exception } from '@src/common/exception/exception';
import { Optional } from '@src/common/types/types';

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
