import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '@common/constants/error-codes';

export interface ConflictErrorResponse {
  success: false;
  message: string;
  error_code: typeof ErrorCodes.BAD_REQUEST;
}

/**
 * Thrown when a resource conflict occurs (e.g. duplicate value).
 * Produces 409 Conflict.
 */
export class ConflictException extends HttpException {
  constructor(message = 'Resource conflict occurred.') {
    const response: ConflictErrorResponse = {
      success: false,
      message,
      error_code: ErrorCodes.BAD_REQUEST,
    };
    super(response, HttpStatus.CONFLICT);
  }
}
