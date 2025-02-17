import { HttpModelUser } from '@modules/identity/http/controller/docs/user/http-model-user';
import { ApiProperty } from '@nestjs/swagger';
import { HttpApiResponse } from '@src/common/api/documentation/http-api-response';

export class HttpResponseUser extends HttpApiResponse {
  @ApiProperty({ type: HttpModelUser })
  public data: HttpModelUser;
}
