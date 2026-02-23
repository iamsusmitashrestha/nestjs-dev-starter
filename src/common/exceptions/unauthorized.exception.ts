import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';

export interface UnauthorizedErrorResponse {
  success: false;
  message: string;
  error_code: typeof ErrorCodes.UNAUTHORIZED;
}

/**
 * Thrown when authentication fails (e.g. invalid or missing JWT).
 * Produces 401 Unauthorized.
 */
export class UnauthorizedException extends HttpException {
  constructor(message = 'Not authenticated.') {
    const response: UnauthorizedErrorResponse = {
      success: false,
      message,
      error_code: ErrorCodes.UNAUTHORIZED,
    };
    super(response, HttpStatus.UNAUTHORIZED);
  }
}
