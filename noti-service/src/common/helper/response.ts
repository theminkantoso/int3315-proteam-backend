import { Injectable } from '@nestjs/common';
import { HttpStatus } from '../constants';

const version = '1.0.0';

const DEFAULT_SUCCESS_MESSAGE = 'success';

export interface IErrorResponse {
  key: string;
  errorCode: number;
  message: string;
}

export class SuccessResponse {
  constructor(data = {}, message = DEFAULT_SUCCESS_MESSAGE) {
    return {
      code: HttpStatus.OK,
      message,
      data,
      version,
    };
  }
}
export class ErrorResponse {
  constructor(
    code = HttpStatus.INTERNAL_SERVER_ERROR,
    message = '',
    errors: IErrorResponse[] = [],
  ) {
    return {
      code,
      message,
      errors,
      version,
    };
  }
}

@Injectable()
export class ApiResponse<T> {
  public code: number;

  public message: string;

  public data: T;

  public errors: IErrorResponse[];
}

export class CommonListResponse<T> {
  items: T[];
  totalItems: number;
}
