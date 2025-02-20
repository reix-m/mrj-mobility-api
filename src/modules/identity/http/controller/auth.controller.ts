import { SignInService } from '@modules/identity/core/features/sign-in/sign-in.service';
import { HttpSignedUser } from '@modules/identity/core/features/sign-in/type/http-signed-user';
import { SignInAdapter } from '@modules/identity/infra/adapter/service/sign-in/sign-in.adapter';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from '@src/common/api/core-api-response';
import { HttpModelSignInBody } from './docs/auth/http-model-sign-body';

@Controller('/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() body: HttpModelSignInBody): Promise<CoreApiResponse<HttpSignedUser>> {
    const adapter: SignInAdapter = await SignInAdapter.new(body);
    const signedUser: HttpSignedUser = await this.signInService.execute(adapter);

    return CoreApiResponse.success('Success.', HttpStatus.OK, signedUser);
  }
}
