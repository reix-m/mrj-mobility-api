import { Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@src/common/filters/exception.filter';
import { HttpLogginInterceptor } from '@src/common/interceptors/loggin.interceptor';
import { ApiServerConfig } from '@src/config/api-server.config';
import { DatabaseModule } from '@src/database/database.module';

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

@Module({ imports: [DatabaseModule], providers: providers })
export class RootModule {}
