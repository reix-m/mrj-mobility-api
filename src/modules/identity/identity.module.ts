import { SignUpService } from '@modules/identity/core/features/sign-up/sign-up.service';
import { UserController } from '@modules/identity/http/controller/user.controller';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { UserRepository } from '@modules/identity/infra/persistence/repository/user.repository';
import { Module, Provider } from '@nestjs/common';

const services: Provider[] = [SignUpService];

const repositories: Provider[] = [UserRepository, UserAccessRepository];

@Module({
  imports: [],
  controllers: [UserController],
  providers: [...services, ...repositories],
})
export class IdentityModule {}
