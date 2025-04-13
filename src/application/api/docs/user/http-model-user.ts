import { HttpModelUserParent } from '@application/api/docs/user/http-model-user-parent';
import { UserResponseDto } from '@core/identity/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class HttpModelUser implements UserResponseDto {
  @ApiProperty({ example: randomUUID() })
  public id: string;

  @ApiProperty({ example: 'Lucas' })
  public firstName: string;

  @ApiProperty({ example: 'Silva' })
  public lastName: string;

  @ApiProperty({ example: 'lucas.silva@email.com.br' })
  public email: string;

  @ApiProperty({ example: Date.now() })
  public createdAt: number;

  @ApiProperty({ example: Date.now() })
  public updatedAt: number;

  @ApiProperty({ type: HttpModelUserParent })
  public parent: HttpModelUserParent;
}
