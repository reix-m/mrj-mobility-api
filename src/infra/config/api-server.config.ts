import { get } from 'env-var';

export class ApiServerConfig {
  public static readonly Host: string = get('API_HOST').required().asString();

  public static readonly Port: number = get('API_PORT').required().asPortNumber();

  public static readonly LogEnable: boolean = get('API_LOG_ENABLE').default('true').asBoolStrict();

  public static readonly AccessTokenSecret: string = get('API_ACCESS_TOKEN_SECRET').required().asString();
}
