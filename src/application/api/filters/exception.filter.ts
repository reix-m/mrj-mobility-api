import { CoreApiResponse } from '@common/api/core-api-response';
import { Exception } from '@common/exception/exception';
import { ApiServerConfig } from '@infra/config/api-server.config';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(error: Error, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse<Response>();

    let errorResponse: CoreApiResponse<unknown> = CoreApiResponse.error(error.message);

    errorResponse = this.handleNestError(error, errorResponse);
    errorResponse = this.handleCoreException(error, errorResponse);

    if (ApiServerConfig.LogEnable) {
      const message: Record<string, unknown> = {
        message: errorResponse.message,
        code: errorResponse.code,
        content: {
          method: request.method,
          hostname: request.hostname,
          originalUrl: request.originalUrl,
          route: request.baseUrl,
          query: request.query,
          params: request.params,
        },
      };
      Logger.error(message, error?.stack);
    }

    response.status(errorResponse.code).json(errorResponse);
  }

  private handleNestError(error: Error, errorResponse: CoreApiResponse<unknown>): CoreApiResponse<unknown> {
    if (error instanceof HttpException) {
      errorResponse = CoreApiResponse.error(error.message, error.getStatus(), error.getResponse());
    }
    return errorResponse;
  }

  private handleCoreException(error: Error, errorResponse: CoreApiResponse<unknown>): CoreApiResponse<unknown> {
    if (error instanceof Exception) {
      errorResponse = CoreApiResponse.error(error.message, error.code, error.data);
    }

    return errorResponse;
  }
}
