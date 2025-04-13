import { AuthController } from '@application/api/controllers/auth.controller';
import { UserController } from '@application/api/controllers/user.controller';
import { HttpExceptionFilter } from '@application/api/filters/exception.filter';
import { HttpLogginInterceptor } from '@application/api/interceptors/loggin.interceptor';
import { IdentityModule } from '@core/identity/identity.module';
import { ApiServerConfig } from '@infra/config/api-server.config';
import { DatabaseModule } from '@infra/database/database.module';
import { Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

if (ApiServerConfig.LogEnable) {
  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: HttpLogginInterceptor,
  });
}

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [UserController, AuthController],
  providers: providers,
})
export class ApiModule {}
