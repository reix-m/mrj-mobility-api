import { ForgotPasswordService } from '@modules/identity/core/features/forgot-password/forgot-password.service';
import { SignInService } from '@modules/identity/core/features/sign-in/sign-in.service';
import { SignUpService } from '@modules/identity/core/features/sign-up/sign-up.service';
import { AuthController } from '@modules/identity/http/controller/auth.controller';
import { UserController } from '@modules/identity/http/controller/user.controller';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { UserRepository } from '@modules/identity/infra/persistence/repository/user.repository';
import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SmtpService } from '@src/common/smtp/smtp.service';
import { ApiServerConfig } from '@src/config/api-server.config';

const services: Provider[] = [SignUpService, SignInService, ForgotPasswordService, SmtpService];

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
export class IdentityModule {}
