import { HttpModelUser } from '@application/api/docs/user/http-model-user';
import { HttpApiResponse } from '@common/api/documentation/http-api-response';
import { ApiProperty } from '@nestjs/swagger';

export class HttpResponseUser extends HttpApiResponse {
  @ApiProperty({ type: HttpModelUser })
  public data: HttpModelUser;
}
