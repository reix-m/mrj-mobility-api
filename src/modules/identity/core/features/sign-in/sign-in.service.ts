import { SignInPort } from '@modules/identity/core/features/sign-in/port/sign-in.port';
import { HttpSignedUser } from '@modules/identity/core/features/sign-in/type/http-signed-user';
import { UserAccess } from '@modules/identity/infra/persistence/entity/user-access.entity';
import { UserAccessRepository } from '@modules/identity/infra/persistence/repository/user-access.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Crypto } from '@src/common/crypto/crypto';
import { Exception } from '@src/common/exception/exception';
import { Nullable } from '@src/common/types/types';

@Injectable()
export class SignInService {
  constructor(
    private readonly userAccessRepository: UserAccessRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(payload: SignInPort): Promise<HttpSignedUser> {
    const userAccess: Nullable<UserAccess> = await this.userAccessRepository.findUserAccess({ email: payload.email });

    if (!userAccess) {
      throw Exception.new({ code: HttpStatus.UNAUTHORIZED, message: 'Email ou senha inválidos.' });
    }

    if (!(await Crypto.compare(userAccess.password, payload.password))) {
      throw Exception.new({ code: HttpStatus.UNAUTHORIZED, message: 'Email ou senha inválidos.' });
    }

    return {
      id: userAccess.userId,
      accessToken: this.jwtService.sign({
        id: userAccess.userId,
      }),
    };
  }
}
