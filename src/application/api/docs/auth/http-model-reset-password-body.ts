import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class HttpModelResetPasswordBody {
  @ApiProperty({ example: randomUUID() })
  public token: string;

  @ApiProperty({ example: randomUUID() })
  public password: string;
}
