import { User } from '@core/identity/entity/user.entity';
import { UserRepository } from '@core/identity/persistence/repository/user.repository';
import { TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';

export class UserFixture {
  constructor(private readonly testingModule: TestingModule) {}

  public async insertUser(data?: { email?: string }): Promise<User> {
    const userRepository: UserRepository = this.testingModule.get(UserRepository);

    const user: User = User.new({
      firstName: randomUUID(),
      lastName: randomUUID(),
      email: data?.email ?? `${randomUUID()}@email.com`,
    });

    const { id }: { id: string } = await userRepository.addUser(user);

    user.id = id;

    return user;
  }

  public static new(testingModule: TestingModule): UserFixture {
    return new UserFixture(testingModule);
  }
}
