import { ForgotPasswordService } from '@core/identity/features/forgot-password/forgot-password.service';
import { ResetPasswordService } from '@core/identity/features/reset-password/reset-password.service';
import { SignInService } from '@core/identity/features/sign-in/sign-in.service';
import { SignUpService } from '@core/identity/features/sign-up/sign-up.service';
import { ValidateResetTokenService } from '@core/identity/features/validate-reset-token/validate-reset-token.service';
import { UserAccessRepository } from '@core/identity/persistence/repository/user-access.repository';
import { UserRepository } from '@core/identity/persistence/repository/user.repository';
import { ApiServerConfig } from '@infra/config/api-server.config';
import { SmtpService } from '@infra/smtp/smtp.service';
import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

const services: Provider[] = [
  SignUpService,
  SignInService,
  ForgotPasswordService,
  ValidateResetTokenService,
  ResetPasswordService,
];

const repositories: Provider[] = [UserRepository, UserAccessRepository];

@Module({
  imports: [
    JwtModule.register({
      secret: ApiServerConfig.AccessTokenSecret,
    }),
  ],
  providers: [...services, ...repositories, SmtpService],
  exports: [...services],
})
export class IdentityModule {}
