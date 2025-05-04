import { Nullable } from '@common/types/types';
import { UserAccess } from '@core/identity/entity/user-access.entity';
import { User } from '@core/identity/entity/user.entity';
import { ResetPasswordAdapter } from '@core/identity/features/reset-password/adapter/reset-password.adapter';
import { UserAccessRepository } from '@core/identity/persistence/repository/user-access.repository';
import { HttpStatus } from '@nestjs/common';
import { TransactionalTest } from '@test/common/transactional-test';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { UserAccessFixture } from '@test/e2e/fixture/user-access.fixture';
import { UserFixture } from '@test/e2e/fixture/user.fixture';
import { IdentityTestModule } from '@test/e2e/tests/identity/identity-test.module';
import { TestServer } from '@test/test-server';
import { Server } from 'http';
import { randomBytes, randomUUID } from 'node:crypto';
import supertest from 'supertest';

describe('Reset Password', () => {
  let testServer: TestServer;
  let userAccessRepository: UserAccessRepository;
  let userAccessFixture: UserAccessFixture;
  let userFixture: UserFixture;
  let transactionalTest: TransactionalTest;
  let httpServer: Server;

  beforeAll(async () => {
    testServer = await TestServer.new(IdentityTestModule);
    userAccessRepository = testServer.testingModule.get(UserAccessRepository);
    transactionalTest = TransactionalTest.new(testServer.dbConnection);
    userAccessFixture = UserAccessFixture.new(testServer.testingModule);
    userFixture = UserFixture.new(testServer.testingModule);
    httpServer = testServer.serverApplication.getHttpServer();

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await transactionalTest.init();
  });

  afterEach(async () => {
    await transactionalTest.close();
  });

  describe('POST /v1/auth/reset-password', () => {
    test('should return "UNPROCESSABLE_ENTITY" response when payload is not valid', async () => {
      const payload: Record<string, unknown> = {
        password: null,
        token: randomUUID(),
      };
      const response: supertest.Response = await supertest(httpServer)
        .post('/v1/auth/reset-password')
        .send(payload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.data.context).toBe(ResetPasswordAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['password']);
      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Não foi possível processar a solicitação.',
      });
    });

    test('should return "BAD_REQUEST" response when user is not found', async () => {
      const payload: Record<string, unknown> = {
        password: randomBytes(8).toString(),
        token: randomUUID(),
      };
      const response: supertest.Response = await supertest(httpServer)
        .post('/v1/auth/reset-password')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.BAD_REQUEST,
        message: 'Usuário não encontrado.',
      });
    });

    test('should return "OK" response when password is reseted', async () => {
      const user: User = await userFixture.insertUser();
      const userAccess: UserAccess = await userAccessFixture.insertUserAccess({ userId: user.id });
      const payload: Record<string, unknown> = {
        password: randomBytes(8).toString(),
        token: userAccess.resetToken,
      };
      const response: supertest.Response = await supertest(httpServer)
        .post('/v1/auth/reset-password')
        .send(payload)
        .expect(HttpStatus.OK);

      expect(response.status).toBe(HttpStatus.OK);

      const resultUserAccess: Nullable<UserAccess> = await userAccessRepository.findUserAccess({ id: userAccess.id });
      expect(resultUserAccess!.resetToken).toBeNull();
      expect(resultUserAccess!.resetTokenExpiresIn).toBeNull();
      expect(resultUserAccess!.updatedAt).toBeDefined();
      expect(resultUserAccess!.password != userAccess.password).toBeTruthy();
    });
  });
});
