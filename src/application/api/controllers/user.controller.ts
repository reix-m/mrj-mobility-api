import { HttpModelSignUpBody } from '@application/api/docs/user/http-model-sign-up-body';
import { HttpResponseUser } from '@application/api/docs/user/http-response-user';
import { CoreApiResponse } from '@common/api/core-api-response';
import { UserResponseDto } from '@core/identity/dto/user-response.dto';
import { SignUpAdapter } from '@core/identity/features/sign-up/adapter/sign-up.adapter';
import { SignUpService } from '@core/identity/features/sign-up/sign-up.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/v1/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: HttpResponseUser })
  @ApiBody({ type: HttpModelSignUpBody })
  public async signUp(@Body() body: HttpModelSignUpBody): Promise<CoreApiResponse<UserResponseDto>> {
    const adapter: SignUpAdapter = await SignUpAdapter.new(body);
    const signedUser: UserResponseDto = await this.signUpService.execute(adapter);

    return CoreApiResponse.success('Created.', HttpStatus.CREATED, signedUser);
  }
}
