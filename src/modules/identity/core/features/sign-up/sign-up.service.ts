import { UserResponseDto } from '@modules/identity/core/dto/user-response.dto';
import { SignUpPort } from '@modules/identity/core/features/sign-up/port/sign-up.port';
import { UserAccess } from '@modules/identity/infra/persistence/entity/user-access.entity';
import { User } from '@modules/identity/infra/persistence/entity/user.entity';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { UserRepository } from '@modules/identity/infra/persistence/repository/user.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Crypto } from '@src/common/crypto/crypto';
import { Exception } from '@src/common/exception/exception';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class SignUpService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAccessRepository: UserAccessRepository,
  ) {}

  @Transactional()
  public async execute(payload: SignUpPort): Promise<UserResponseDto> {
    const exists: boolean = !!(await this.userRepository.findUser({
      email: payload.email,
    }));

    if (exists) {
      throw Exception.new({
        code: HttpStatus.BAD_REQUEST,
        message: 'Usuário já possui cadastro.',
      });
    }

    const user: User = User.new({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    });

    const { id }: { id: string } = await this.userRepository.addUser(user);
    user.id = id;

    const userAccess: UserAccess = UserAccess.new({
      user: user,
      userId: user.id,
      password: await Crypto.hash(payload.password),
    });

    await this.userAccessRepository.addUserAccess(userAccess);

    return UserResponseDto.newFromUser(user);
  }
}
