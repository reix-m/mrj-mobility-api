import { get } from 'env-var';

export class SmtpConfig {
  public static readonly Host: string = get('SMTP_HOST').required().asString();

  public static readonly Port: number = get('SMTP_PORT').required().asPortNumber();

  public static readonly Username: string = get('SMTP_USERNAME').required().asString();

  public static readonly Password: string = get('SMTP_PASSWORD').required().asString();

  public static readonly DefaultSender: string = get('SMTP_DEFAULT_SENDER')
    .default('noreply@mrj-mobility.com.br')
    .asEmailString();
}
