import { HttpModelValidateResetToken } from '@application/api/docs/auth/http-model-validate-reset-token';
import { HttpApiResponse } from '@common/api/documentation/http-api-response';
import { ApiProperty } from '@nestjs/swagger';

export class HttpResponseValidateResetToken extends HttpApiResponse {
  @ApiProperty({ type: HttpModelValidateResetToken })
  public data: HttpModelValidateResetToken;
}
