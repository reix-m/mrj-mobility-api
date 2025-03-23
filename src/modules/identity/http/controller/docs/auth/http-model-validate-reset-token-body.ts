import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class HttpModelValidateResetTokenBody {
  @ApiProperty({ example: randomUUID() })
  public token: string;
}
