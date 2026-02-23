import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';

export interface ForbiddenErrorResponse {
  success: false;
  message: string;
  error_code: typeof ErrorCodes.FORBIDDEN;
}

/**
 * Thrown when the user is authenticated but not authorized to perform the action.
 * Produces 403 Forbidden.
 */
export class ForbiddenException extends HttpException {
  constructor(message = 'You do not have permission to perform this action.') {
    const response: ForbiddenErrorResponse = {
      success: false,
      message,
      error_code: ErrorCodes.FORBIDDEN,
    };
    super(response, HttpStatus.FORBIDDEN);
  }
}
