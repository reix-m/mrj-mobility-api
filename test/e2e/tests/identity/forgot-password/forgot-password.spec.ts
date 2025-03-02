import { ForgotPasswordAdapter } from '@modules/identity/infra/adapter/service/forgot-password/forgot-password.adapter';
import { UserAccess } from '@modules/identity/infra/persistence/entity/user-access.entity';
import { User } from '@modules/identity/infra/persistence/entity/user.entity';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { HttpStatus } from '@nestjs/common';
import { Crypto } from '@src/common/crypto/crypto';
import { Nullable } from '@src/common/types/types';
import { GlobalConfig } from '@src/config/global.config';
import { TransactionalTest } from '@test/common/transactional-test';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { UserAccessFixture } from '@test/e2e/fixture/user-access.fixture';
import { UserFixture } from '@test/e2e/fixture/user.fixture';
import { IdentityTestModule } from '@test/e2e/tests/identity/identity-test.module';
import { TestServer } from '@test/test-server';
import { randomUUID } from 'node:crypto';
import supertest from 'supertest';

describe('Forgot Password', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let userAccessFixture: UserAccessFixture;
  let userAccessRepository: UserAccessRepository;
  let transactionaTest: TransactionalTest;

  beforeAll(async () => {
    testServer = await TestServer.new(IdentityTestModule);
    userFixture = UserFixture.new(testServer.testingModule);
    userAccessFixture = UserAccessFixture.new(testServer.testingModule);
    userAccessRepository = testServer.testingModule.get(UserAccessRepository);
    transactionaTest = TransactionalTest.new(testServer.dbConnection);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await transactionaTest.init();
  });

  afterEach(async () => {
    await transactionaTest.close();
  });

  describe('POST /v1/auth/forgot-password', () => {
    test('should return "UNPROCESSABLE_ENTITY" response when payload is not valid', async () => {
      const payload: Record<string, string> = {
        email: randomUUID(),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/auth/forgot-password')
        .send(payload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.data.context).toBe(ForgotPasswordAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['email']);
      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Não foi possível processar a solicitação.',
      });
    });

    test('when user not found, should return "OK" response when reset password email is not sended', async () => {
      const payload: Record<string, unknown> = {
        email: `${randomUUID()}@email.com.br`,
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/auth/forgot-password')
        .send(payload)
        .expect(HttpStatus.OK);

      ResponseExpect.codeAndMessage(response.body, { code: HttpStatus.OK, message: 'Success.' });
      ResponseExpect.data({ response: response.body }, null);

      const userAccess: Nullable<UserAccess> = await userAccessRepository.findUserAccess({
        email: payload.email as string,
      });
      expect(userAccess).toBeNull();
    });

    test('when user is found, should return "OK" response when reset password email is sended', async () => {
      jest.useFakeTimers();

      const user: User = await userFixture.insertUser();
      const userAccess: UserAccess = await userAccessFixture.insertUserAccess({ userId: user.id });

      const payload: Record<string, string> = {
        email: user.email,
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/auth/forgot-password')
        .send(payload)
        .expect(HttpStatus.OK);

      const resultUserAccess: UserAccess = (await userAccessRepository.findUserAccess({
        id: userAccess.id,
      })) as UserAccess;

      const expectedResetTokenExpiresIn: number = Date.now() + GlobalConfig.ResetTokenExpiresHours * 60 * 60 * 1000;

      expect(await Crypto.compare(resultUserAccess.resetToken as string, GlobalConfig.ResetTokenSecret)).toBeTruthy();
      expect(resultUserAccess.resetTokenExpiresIn!.getTime()).toBe(expectedResetTokenExpiresIn);
      expect(resultUserAccess.updatedAt!.getTime()).toBe(Date.now());
      ResponseExpect.codeAndMessage(response.body, { code: HttpStatus.OK, message: 'Success.' });

      jest.useRealTimers();
    });
  });
});
