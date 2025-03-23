import { ApiProperty } from '@nestjs/swagger';
import { HttpApiResponse } from '@src/common/api/documentation/http-api-response';

export class HttpModelValidateResetToken {
  @ApiProperty({ example: true })
  public isValid: boolean;
}

export class HttpResponseValidateResetToken extends HttpApiResponse {
  @ApiProperty({ type: HttpModelValidateResetToken })
  public data: HttpModelValidateResetToken;
}
