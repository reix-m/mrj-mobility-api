import { UserAccess } from '@modules/identity/infra/persistence/entity/user-access.entity';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { Injectable } from '@nestjs/common';
import { Nullable } from '@src/common/types/types';

@Injectable()
export class ValidateResetTokenService {
  constructor(private readonly userAccessRepository: UserAccessRepository) {}

  public async execute(port: { token: string }): Promise<{ isValid: boolean }> {
    const userAccess: Nullable<UserAccess> = await this.userAccessRepository.findUserAccess({
      resetToken: port.token,
      resetTokenExpiresIn: new Date(),
    });

    if (!userAccess) {
      return {
        isValid: false,
      };
    }

    return {
      isValid: true,
    };
  }
}
