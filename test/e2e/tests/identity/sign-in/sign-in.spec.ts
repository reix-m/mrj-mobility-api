import { SignInAdapter } from '@modules/identity/infra/adapter/service/sign-in/sign-in.adapter';
import { User } from '@modules/identity/infra/persistence/entity/user.entity';
import { HttpStatus } from '@nestjs/common';
import { TransactionalTest } from '@test/common/transactional-test';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { UserAccessFixture } from '@test/e2e/fixture/user-access.fixture';
import { UserFixture } from '@test/e2e/fixture/user.fixture';
import { IdentityTestModule } from '@test/e2e/tests/identity/identity-test.module';
import { TestServer } from '@test/test-server';
import { randomBytes, randomUUID } from 'node:crypto';
import supertest from 'supertest';

describe('Sign In', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let userAccessFixture: UserAccessFixture;
  let transactionalTest: TransactionalTest;

  beforeAll(async () => {
    testServer = await TestServer.new(IdentityTestModule);

    userFixture = UserFixture.new(testServer.testingModule);
    userAccessFixture = UserAccessFixture.new(testServer.testingModule);
    transactionalTest = TransactionalTest.new(testServer.dbConnection);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  beforeEach(async () => {
    await transactionalTest.init();
  });

  afterEach(async () => {
    await transactionalTest.close();
  });

  describe('POST /v1/auth/sign-in', () => {
    test('should return "UNPROCESSABLE_ENTITY" response when payload is not valid', async () => {
      const payload: Record<string, unknown> = {
        email: '',
        password: randomUUID(),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(payload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.data.context).toBe(SignInAdapter.name);
      expect(response.body.data.errors.map((err: Record<string, unknown>) => err.property)).toEqual(['email']);
      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Não foi possível processar a solicitação.',
      });
    });

    test('should return "UNAUTHORIZED" response when email not exists', async () => {
      const payload: Record<string, string> = {
        email: `${randomUUID()}@email.com`,
        password: randomBytes(8).toString('hex'),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(payload)
        .expect(HttpStatus.UNAUTHORIZED);

      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Email ou senha inválidos.',
      });
    });

    test('should return "UNAUTHORIZED" response when password is not valid', async () => {
      const user: User = await userFixture.insertUser();
      await userAccessFixture.insertUserAccess({ userId: user.id });
      const payload: Record<string, string> = {
        email: user.email,
        password: randomBytes(8).toString('hex'),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(payload)
        .expect(HttpStatus.UNAUTHORIZED);

      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Email ou senha inválidos.',
      });
    });

    test('should return "OK" response when user is authenticated', async () => {
      const user: User = await userFixture.insertUser();
      const password: string = randomBytes(8).toString('hex');
      await userAccessFixture.insertUserAccess({ userId: user.id, password: password });
      const payload: Record<string, string> = {
        email: user.email,
        password: password,
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(payload)
        .expect(HttpStatus.OK);

      ResponseExpect.codeAndMessage(response.body, { code: HttpStatus.OK, message: 'Success.' });
      expect(response.body.data.id).toBe(user.id);
    });
  });
});
