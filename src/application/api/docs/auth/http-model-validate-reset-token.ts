import { HttpApiResponse } from '@common/api/documentation/http-api-response';
import { ApiProperty } from '@nestjs/swagger';

export class HttpModelValidateResetToken {
  @ApiProperty({ example: true })
  public isValid: boolean;
}

export class HttpResponseValidateResetToken extends HttpApiResponse {
  @ApiProperty({ type: HttpModelValidateResetToken })
  public data: HttpModelValidateResetToken;
}
