import { AuthController } from '@application/api/controllers/auth.controller';
import { UserController } from '@application/api/controllers/user.controller';
import { ForgotPasswordService } from '@core/identity/features/forgot-password/forgot-password.service';
import { ResetPasswordService } from '@core/identity/features/reset-password/reset-password.service';
import { SignInService } from '@core/identity/features/sign-in/sign-in.service';
import { SignUpService } from '@core/identity/features/sign-up/sign-up.service';
import { ValidateResetTokenService } from '@core/identity/features/validate-reset-token/validate-reset-token.service';
import { UserAccessRepository } from '@core/identity/persistence/repository/user-access.repository';
import { UserRepository } from '@core/identity/persistence/repository/user.repository';
import { createMock } from '@golevelup/ts-jest';
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
  { provide: SmtpService, useValue: createMock() },
];

const repositories: Provider[] = [UserRepository, UserAccessRepository];

@Module({
  imports: [
    JwtModule.register({
      secret: ApiServerConfig.AccessTokenSecret,
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [...services, ...repositories],
})
export class IdentityTestModule {}
