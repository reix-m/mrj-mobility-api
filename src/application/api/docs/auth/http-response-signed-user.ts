import { HttpModelSignedUser } from '@application/api/docs/auth/http-model-signed-user';
import { HttpApiResponse } from '@common/api/documentation/http-api-response';
import { ApiProperty } from '@nestjs/swagger';

export class HttpResponseSignedUser extends HttpApiResponse {
  @ApiProperty({ type: HttpModelSignedUser })
  public data: HttpModelSignedUser;
}
