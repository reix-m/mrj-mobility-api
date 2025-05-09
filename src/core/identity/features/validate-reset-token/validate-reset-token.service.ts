import { Nullable } from '@common/types/types';
import { UserAccess } from '@core/identity/entity/user-access.entity';
import { UserAccessRepository } from '@core/identity/persistence/repository/user-access.repository';
import { Injectable } from '@nestjs/common';

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
