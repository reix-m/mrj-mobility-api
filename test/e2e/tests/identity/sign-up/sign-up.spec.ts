import { Nullable } from '@common/types/types';
import { UserResponseDto } from '@core/identity/dto/user-response.dto';
import { User } from '@core/identity/entity/user.entity';
import { SignUpAdapter } from '@core/identity/features/sign-up/adapter/sign-up.adapter';
import { UserRepository } from '@core/identity/persistence/repository/user.repository';
import { HttpStatus } from '@nestjs/common';
import { TransactionalTest } from '@test/common/transactional-test';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { UserFixture } from '@test/e2e/fixture/user.fixture';
import { IdentityTestModule } from '@test/e2e/tests/identity/identity-test.module';
import { TestServer } from '@test/test-server';
import { randomBytes, randomUUID } from 'node:crypto';
import supertest from 'supertest';

describe('Sign Up', () => {
  let testServer: TestServer;
  let userRepository: UserRepository;
  let userFixture: UserFixture;
  let transactionalTest: TransactionalTest;

  beforeAll(async () => {
    testServer = await TestServer.new(IdentityTestModule);

    userRepository = testServer.testingModule.get(UserRepository);
    userFixture = UserFixture.new(testServer.testingModule);
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

  describe('POST /v1/users/sign-up', () => {
    test('should return "UNPROCESSABLE_ENTITY" response when payload is not valid', async () => {
      const payload: Record<string, unknown> = {
        firstName: randomUUID(),
        lastName: randomUUID(),
        email: '',
        password: randomBytes(8).toString('hex'),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/users/sign-up')
        .send(payload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.data.context).toBe(SignUpAdapter.name);
      expect(response.body.data.errors.map((err: Record<string, unknown>) => err.property)).toEqual(['email']);

      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Não foi possível processar a solicitação.',
      });
    });

    test('should return "BAD_REQUEST" response when user email already exists', async () => {
      const user: User = await userFixture.insertUser();
      const payload: Record<string, unknown> = {
        firstName: randomUUID(),
        lastName: randomUUID(),
        email: user.email,
        password: randomBytes(8).toString('hex'),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/users/sign-up')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      ResponseExpect.codeAndMessage(response.body, {
        code: HttpStatus.BAD_REQUEST,
        message: 'Usuário já possui cadastro.',
      });
    });

    test('should return "CREATED" response when user is created', async () => {
      const payload: Record<string, unknown> = {
        firstName: randomUUID(),
        lastName: randomUUID(),
        email: `${randomUUID()}@gmail.com`,
        password: randomBytes(8).toString('hex'),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/v1/users/sign-up')
        .send(payload)
        .expect(HttpStatus.CREATED);

      const createdUser: Nullable<User> = await userRepository.findUser({ id: response.body.data.id });

      expect(createdUser).not.toBeNull();

      const expectedUser: User = User.new({
        id: createdUser!.id,
        firstName: payload.firstName as string,
        lastName: payload.lastName as string,
        email: payload.email as string,
        createdAt: createdUser!.createdAt,
        updatedAt: null,
        parentId: null,
        parent: null,
        removedAt: null,
      });

      expect(createdUser).toEqual(expectedUser);
      ResponseExpect.codeAndMessage(response.body, { code: HttpStatus.CREATED, message: 'Created.' });
      ResponseExpect.data({ response: response.body }, UserResponseDto.newFromUser(expectedUser));
    });
  });
});
