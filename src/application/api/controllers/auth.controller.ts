import { CoreApiResponse } from '@common/api/core-api-response';
import { ForgotPasswordAdapter } from '@core/identity/features/forgot-password/adapter/forgot-password.adapter';
import { ForgotPasswordService } from '@core/identity/features/forgot-password/forgot-password.service';
import { SignInAdapter } from '@core/identity/features/sign-in/adapter/sign-in.adapter';
import { SignInService } from '@core/identity/features/sign-in/sign-in.service';
import { HttpSignedUser } from '@core/identity/features/sign-in/type/http-signed-user';
import { ValidateResetTokenAdapter } from '@core/identity/features/validate-reset-token/adapter/validate-reset-token.adapter';
import { ValidateResetTokenService } from '@core/identity/features/validate-reset-token/validate-reset-token.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpModelForgotPasswordBody } from '@application/api/docs/auth/http-model-forgot-password-body';
import { HttpModelSignInBody } from '@application/api/docs/auth/http-model-sign-body';
import { HttpResponseValidateResetToken } from '@application/api/docs/auth/http-model-validate-reset-token';
import { HttpModelValidateResetTokenBody } from '@application/api/docs/auth/http-model-validate-reset-token-body';
import { HttpResponseSignedUser } from '@application/api/docs/auth/http-response-signed-user';

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
