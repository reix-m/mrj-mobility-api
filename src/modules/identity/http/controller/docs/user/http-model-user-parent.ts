import { UserParentResponseDto } from '@modules/identity/core/dto/user-parent-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class HttpModelUserParent implements UserParentResponseDto {
  @ApiProperty({ example: randomUUID() })
  public id: string;

  @ApiProperty({ example: 'João' })
  public firstName: string;

  @ApiProperty({ example: 'Silva' })
  public lastName: string;
}
