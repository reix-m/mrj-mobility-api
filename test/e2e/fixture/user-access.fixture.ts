import { UserAccess } from '@modules/identity/infra/persistence/entity/user-access.entity';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { TestingModule } from '@nestjs/testing';
import { Crypto } from '@src/common/crypto/crypto';
import { randomBytes } from 'node:crypto';

export class UserAccessFixture {
  constructor(private readonly testingModule: TestingModule) {}

  public async insertUserAccess(data: { userId: string; password?: string }): Promise<UserAccess> {
    const userAccessRepository: UserAccessRepository = this.testingModule.get(UserAccessRepository);

    const password: string = data?.password ?? randomBytes(8).toString('hex');
    const userAccess: UserAccess = UserAccess.new({
      userId: data.userId,
      password: await Crypto.hash(password),
    });

    const { id }: { id: string } = await userAccessRepository.addUserAccess(userAccess);
    userAccess.id = id;

    return userAccess;
  }

  public static new(testingModule: TestingModule): UserAccessFixture {
    return new UserAccessFixture(testingModule);
  }
}
