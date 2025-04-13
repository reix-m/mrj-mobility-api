import { Crypto } from '@common/crypto/crypto';
import { Nullable } from '@common/types/types';
import { UserAccess } from '@core/identity/entity/user-access.entity';
import { ForgotPasswordPort } from '@core/identity/features/forgot-password/port/forgot-password.port';
import { UserAccessRepository } from '@core/identity/persistence/repository/user-access.repository';
import { GlobalConfig } from '@infra/config/global.config';
import { SmtpService } from '@infra/smtp/smtp.service';
import { ResetPasswordTemplate } from '@infra/smtp/templates/reset-password.template';
import { Injectable } from '@nestjs/common';
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
