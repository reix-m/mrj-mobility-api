import { UserResponseDto } from '@modules/identity/core/dto/user-response.dto';
import { SignUpService } from '@modules/identity/core/features/sign-up/sign-up.service';
import { HttpModelSignUpBody } from '@modules/identity/http/controller/docs/user/http-model-sign-up-body';
import { HttpResponseUser } from '@modules/identity/http/controller/docs/user/http-response-user';
import { SignUpAdapter } from '@modules/identity/infra/adapter/sign-up.adapter';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from '@src/common/api/core-api-response';

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
