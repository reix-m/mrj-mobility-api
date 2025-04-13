import { CoreApiResponse } from '@common/api/core-api-response';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpLogginInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler<never>): Observable<CoreApiResponse<void>> {
    const request: Request = context.switchToHttp().getRequest();
    const requestStartDate: number = Date.now();

    return next.handle().pipe(
      tap((): void => {
        const requestFinishDate: number = Date.now();

        const message: Record<string, unknown> = {
          method: request.method,
          path: request.path,
          spentTime: `${requestFinishDate - requestStartDate}ms`,
        };

        Logger.log(message, HttpLogginInterceptor.name);
      }),
    );
  }
}
