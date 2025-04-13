import { ApiProperty } from '@nestjs/swagger';

export class HttpModelSignUpBody {
  @ApiProperty({ required: true, example: 'Lucas' })
  public firstName: string;

  @ApiProperty({ required: true, example: 'Silva' })
  public lastName: string;

  @ApiProperty({ required: true, example: 'lucas.silva@email.com.br' })
  public email: string;

  @ApiProperty({ required: true, example: 'LucasSilva@123' })
  public password: string;
}
