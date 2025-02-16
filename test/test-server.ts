import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { RootTestModule } from '@test/root-test.module';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly dbConnection: DataSource,
    public readonly testingModule: TestingModule,
  ) {}

  public static async new(): Promise<TestServer> {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    const testingModule: TestingModule = await Test.createTestingModule({ imports: [RootTestModule] }).compile();

    const dbConnection: DataSource = testingModule.get(getDataSourceToken());

    const serverApplication: NestExpressApplication = testingModule.createNestApplication();

    serverApplication.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    );

    return new TestServer(serverApplication, dbConnection, testingModule);
  }
}
