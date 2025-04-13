import { Optional } from '@common/types/types';

export type CreateExceptionPayload<TData> = {
  code: number;
  message: string;
  data?: TData;
};

export class Exception<TData> extends Error {
  public readonly code: number;

  public readonly data: Optional<TData>;

  private constructor(code: number, message: string, data?: TData) {
    super();

    this.name = this.constructor.name;
    this.code = code;
    this.data = data;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }

  public static new<TData>(payload: CreateExceptionPayload<TData>): Exception<TData> {
    return new Exception(payload.code, payload.message, payload.data);
  }
}
