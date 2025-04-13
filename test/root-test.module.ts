import { HttpExceptionFilter } from '@application/api/filters/exception.filter';
import { DatabaseModule } from '@infra/database/database.module';
import { Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

@Module({ imports: [DatabaseModule], providers: providers })
export class RootTestModule {}
