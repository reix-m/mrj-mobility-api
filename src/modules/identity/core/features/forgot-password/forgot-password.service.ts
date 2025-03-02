import { ForgotPasswordPort } from '@modules/identity/core/features/forgot-password/port/forgot-password.port';
import { UserAccess } from '@modules/identity/infra/persistence/entity/user-access.entity';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { Injectable } from '@nestjs/common';
import { Crypto } from '@src/common/crypto/crypto';
import { SmtpService } from '@src/common/smtp/smtp.service';
import { ResetPasswordTemplate } from '@src/common/smtp/templates/reset-password.template';
import { Nullable } from '@src/common/types/types';
import { GlobalConfig } from '@src/config/global.config';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly userAccessRepository: UserAccessRepository,
    private readonly smtpService: SmtpService,
  ) {}

  @Transactional()
  public async execute(port: ForgotPasswordPort): Promise<void> {
    const userAccess: Nullable<UserAccess> = await this.userAccessRepository.findUserAccess({ email: port.email });

    if (!userAccess) {
      return;
    }

    const resetToken: string = await Crypto.hash(GlobalConfig.ResetTokenSecret);
    const tokenExpiresIn: number = Date.now() + GlobalConfig.ResetTokenExpiresHours * 60 * 60 * 1000;
    const resetTokenUrl: string = GlobalConfig.ResetPasswordUrl.toString() + `?token=${resetToken}`;

    userAccess.updatedAt = new Date();
    userAccess.resetTokenExpiresIn = new Date(tokenExpiresIn);
    userAccess.resetToken = resetToken;

    await this.userAccessRepository.updateUserAccess({ id: userAccess.id }, userAccess);

    await this.smtpService.send({
      to: port.email,
      subject: 'Redefinição de senha - Mrj Mobility',
      html: ResetPasswordTemplate.new({
        firstName: userAccess.user!.firstName,
        resetUrl: resetTokenUrl,
        companyName: GlobalConfig.CompanyName,
        supportEmail: GlobalConfig.SupportEmail,
      }),
    });
  }
}
