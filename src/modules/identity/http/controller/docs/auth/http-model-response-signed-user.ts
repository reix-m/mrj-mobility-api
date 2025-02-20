import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class HttpModelResponseSignedUser {
  @ApiProperty({ example: randomUUID() })
  public id: string;

  @ApiProperty({ example: randomUUID() })
  public accessToken: string;
}
