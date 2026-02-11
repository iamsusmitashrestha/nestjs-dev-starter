import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '@common/constants/error-codes';

export interface ServerErrorResponse {
  success: false;
  message: string;
  error_code: typeof ErrorCodes.SERVER_ERROR;
}

/**
 * Thrown for unexpected server errors.
 * Produces 500 Internal Server Error with generic message.
 */
export class ServerErrorException extends HttpException {
  constructor(message = 'Something went wrong. Please try again later.') {
    const response: ServerErrorResponse = {
      success: false,
      message,
      error_code: ErrorCodes.SERVER_ERROR,
    };
    super(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
