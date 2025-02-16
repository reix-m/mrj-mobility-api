import { Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@src/common/filters/exception.filter';
import { DatabaseModule } from '@src/database/database.module';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

@Module({ imports: [DatabaseModule], providers: providers })
export class RootTestModule {}
