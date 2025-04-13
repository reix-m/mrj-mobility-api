import { UserAccess } from '@core/identity/entity/user-access.entity';
import { User } from '@core/identity/entity/user.entity';
import { ValidateResetTokenAdapter } from '@core/identity/features/validate-reset-token/adapter/validate-reset-token.adapter';
import { HttpStatus } from '@nestjs/common';
import { TransactionalTest } from '@test/common/transactional-test';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { UserAccessFixture } from '@test/e2e/fixture/user-access.fixture';
import { UserFixture } from '@test/e2e/fixture/user.fixture';
import { IdentityTestModule } from '@test/e2e/tests/identity/identity-test.module';
import { TestServer } from '@test/test-server';
import { randomUUID } from 'node:crypto';
import { Server } from 'node:http';
import supertest from 'supertest';

describe('Validate Reset Token', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let userAccessFixture: UserAccessFixture;
  let transactionalTest: TransactionalTest;
  let httpServer: Server;

  beforeAll(async () => {
    testServer = await TestServer.new(IdentityTestModule);
    userFixture = UserFixture.new(testServer.testingModule);
    userAccessFixture = UserAccessFixture.new(testServer.testingModule);
    transactionalTest = TransactionalTest.new(testServer.dbConnection);

    await testServer.serverApplication.init();

    httpServer = testServer.serverApplication.getHttpServer();
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

  describe('POST /v1/auth/validate-reset-token', () => {
    test('should return "UNPROCESSABLE_ENTITY" response when payload is not valid', async () => {
      const payload: Record<string, unknown> = {
        token: null,
      };
      const response: supertest.Response = await supertest(httpServer)
        .post(`/v1/auth/validate-reset-token`)
        .send(payload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.data.context).toBe(ValidateResetTokenAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['token']);
      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Não foi possível processar a solicitação.',
      });
    });

    test('should return "OK" response and is valid equal false when token is not valid', async () => {
      const payload: Record<string, unknown> = {
        token: randomUUID(),
      };

      const response: supertest.Response = await supertest(httpServer)
        .post('/v1/auth/validate-reset-token')
        .send(payload)
        .expect(HttpStatus.OK);

      ResponseExpect.codeAndMessage(response.body, { code: HttpStatus.OK, message: 'Success.' });
      ResponseExpect.data({ response: response.body }, { isValid: false });
    });

    test('shold return "OK" response and is valid equal true when token is valid', async () => {
      const user: User = await userFixture.insertUser();
      const userAccess: UserAccess = await userAccessFixture.insertUserAccess({ userId: user.id });
      const payload: Record<string, unknown> = {
        token: userAccess.resetToken,
      };

      const response: supertest.Response = await supertest(httpServer)
        .post('/v1/auth/validate-reset-token')
        .send(payload)
        .expect(HttpStatus.OK);

      ResponseExpect.codeAndMessage(response.body, { code: HttpStatus.OK, message: 'Success.' });
      ResponseExpect.data({ response: response.body }, { isValid: true });
    });
  });
});
