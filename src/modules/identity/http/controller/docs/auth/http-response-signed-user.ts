import { HttpModelSignedUser } from '@modules/identity/http/controller/docs/auth/http-model-signed-user';
import { ApiProperty } from '@nestjs/swagger';
import { HttpApiResponse } from '@src/common/api/documentation/http-api-response';

export class HttpResponseSignedUser extends HttpApiResponse {
  @ApiProperty({ type: HttpModelSignedUser })
  public data: HttpModelSignedUser;
}
