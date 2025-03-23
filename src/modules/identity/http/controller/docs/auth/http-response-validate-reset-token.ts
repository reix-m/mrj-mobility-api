import { HttpModelValidateResetToken } from '@modules/identity/http/controller/docs/auth/http-model-validate-reset-token';
import { ApiProperty } from '@nestjs/swagger';
import { HttpApiResponse } from '@src/common/api/documentation/http-api-response';

export class HttpResponseValidateResetToken extends HttpApiResponse {
  @ApiProperty({ type: HttpModelValidateResetToken })
  public data: HttpModelValidateResetToken;
}
