import { get } from 'env-var';

export class GlobalConfig {
  public static readonly CompanyName: string = get('COMPANY_NAME').required().asString();

  public static readonly SupportEmail: string = get('SUPPORT_EMAIL')
    .default('support@mrj-mobility.com.br')
    .asEmailString();

  public static readonly FrontEndBaseUrl: string = get('FRONTEND_BASE_URL').required().asUrlString();

  public static readonly ResetTokenSecret: string = get('RESET_TOKEN_SECRET').required().asString();

  public static readonly ResetTokenExpiresHours: number = get('RESET_TOKEN_EXPIRES_HOURS').required().asIntPositive();

  public static readonly ResetPasswordUrl: URL = new URL('/reset-password', this.FrontEndBaseUrl);
}
