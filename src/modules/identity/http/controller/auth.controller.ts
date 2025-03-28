import { ForgotPasswordService } from '@modules/identity/core/features/forgot-password/forgot-password.service';
import { SignInService } from '@modules/identity/core/features/sign-in/sign-in.service';
import { HttpSignedUser } from '@modules/identity/core/features/sign-in/type/http-signed-user';
import { ValidateResetTokenService } from '@modules/identity/core/features/validate-reset-token/validate-reset-token.service';
import { HttpModelForgotPasswordBody } from '@modules/identity/http/controller/docs/auth/http-model-forgot-password-body';
import { HttpModelSignInBody } from '@modules/identity/http/controller/docs/auth/http-model-sign-body';
import { HttpResponseValidateResetToken } from '@modules/identity/http/controller/docs/auth/http-model-validate-reset-token';
import { HttpModelValidateResetTokenBody } from '@modules/identity/http/controller/docs/auth/http-model-validate-reset-token-body';
import { HttpResponseSignedUser } from '@modules/identity/http/controller/docs/auth/http-response-signed-user';
import { ForgotPasswordAdapter } from '@modules/identity/infra/adapter/service/forgot-password/forgot-password.adapter';
import { SignInAdapter } from '@modules/identity/infra/adapter/service/sign-in/sign-in.adapter';
import { ValidateResetTokenAdapter } from '@modules/identity/infra/adapter/service/validate-reset-token.adapter';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from '@src/common/api/core-api-response';

@Controller('/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly signInService: SignInService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly validateResetTokenService: ValidateResetTokenService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: HttpModelSignInBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpResponseSignedUser })
  public async signIn(@Body() body: HttpModelSignInBody): Promise<CoreApiResponse<HttpSignedUser>> {
    const adapter: SignInAdapter = await SignInAdapter.new(body);
    const signedUser: HttpSignedUser = await this.signInService.execute(adapter);

    return CoreApiResponse.success('Success.', HttpStatus.OK, signedUser);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public async forgot(@Body() body: HttpModelForgotPasswordBody): Promise<CoreApiResponse<null>> {
    const adapter: ForgotPasswordAdapter = await ForgotPasswordAdapter.new(body);
    await this.forgotPasswordService.execute(adapter);

    return CoreApiResponse.success('Success.', HttpStatus.OK, null);
  }

  @Post('validate-reset-token')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: HttpModelValidateResetTokenBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpResponseValidateResetToken })
  public async validateResetToken(
    @Body() body: HttpModelValidateResetTokenBody,
  ): Promise<CoreApiResponse<{ isValid: boolean }>> {
    const adapter: ValidateResetTokenAdapter = await ValidateResetTokenAdapter.new(body);
    const tokenIsValid: { isValid: boolean } = await this.validateResetTokenService.execute(adapter);

    return CoreApiResponse.success('Success.', HttpStatus.OK, tokenIsValid);
  }
}
