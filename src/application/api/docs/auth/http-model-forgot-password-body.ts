import { ApiProperty } from '@nestjs/swagger';

export class HttpModelForgotPasswordBody {
  @ApiProperty({ example: 'joao.silva@email.com.br' })
  public email: string;
}
