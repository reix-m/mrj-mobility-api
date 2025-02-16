import { HttpStatus } from '@nestjs/common';
import { Nullable } from '@src/common/types/types';

export class CoreApiResponse<TData> {
  public readonly code: number;

  public readonly message: string;

  public readonly timestamp: number;

  public readonly data: Nullable<TData>;

  private constructor(code: number, message: string, data?: TData) {
    this.code = code;
    this.message = message;
    this.data = data ?? null;
    this.timestamp = Date.now();
  }

  public static success<TData>(message: string, code?: number, data?: TData): CoreApiResponse<TData> {
    const resultCode: number = code ?? HttpStatus.OK;
    const resultMessage: string = message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }

  public static error<TData>(message: string, code?: number, data?: TData): CoreApiResponse<TData> {
    const resultCode: number = code ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const resultMessage: string = message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }
}
