import { Crypto } from '@common/crypto/crypto';
import { Exception } from '@common/exception/exception';
import { Nullable } from '@common/types/types';
import { UserAccess } from '@core/identity/entity/user-access.entity';
import { ResetPasswordPort } from '@core/identity/features/reset-password/port/reset-password.port';
import { UserAccessRepository } from '@core/identity/persistence/repository/user-access.repository';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ResetPasswordService {
  constructor(private readonly userAccessRepository: UserAccessRepository) {}

  public async execute(port: ResetPasswordPort): Promise<void> {
    const userAccess: Nullable<UserAccess> = await this.userAccessRepository.findUserAccess({
      resetToken: port.token,
      resetTokenExpiresIn: new Date(),
    });

    if (!userAccess) {
      throw Exception.new({
        code: HttpStatus.BAD_REQUEST,
        message: 'Usuário não encontrado.',
      });
    }

    userAccess.password = await Crypto.hash(port.password);
    userAccess.resetToken = null;
    userAccess.resetTokenExpiresIn = null;
    userAccess.updatedAt = new Date();

    await this.userAccessRepository.updateUserAccess({ id: userAccess.id }, userAccess);
  }
}
