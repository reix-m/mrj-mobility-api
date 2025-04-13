import { Crypto } from '@common/crypto/crypto';
import { Exception } from '@common/exception/exception';
import { Nullable } from '@common/types/types';
import { UserAccess } from '@core/identity/entity/user-access.entity';
import { SignInPort } from '@core/identity/features/sign-in/port/sign-in.port';
import { HttpSignedUser } from '@core/identity/features/sign-in/type/http-signed-user';
import { UserAccessRepository } from '@core/identity/persistence/repository/user-access.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
