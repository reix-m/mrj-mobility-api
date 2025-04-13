import { ApiProperty } from '@nestjs/swagger';

export class HttpModelSignInBody {
  @ApiProperty({ example: 'joao.silva@email.com.br' })
  public email: string;

  @ApiProperty({ example: 'JoaoSilva@123' })
  public password: string;
}
