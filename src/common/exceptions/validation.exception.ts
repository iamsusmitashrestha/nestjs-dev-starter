import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '@common/constants/error-codes';

export interface ValidationErrorResponse {
  success: false;
  message: string;
  error_code: typeof ErrorCodes.VALIDATION_ERROR;
  errors: Record<string, string[]>;
}

/**
 * Thrown when request validation fails (e.g. class-validator).
 * Produces 422 Unprocessable Entity with field-level errors.
 */
export class ValidationException extends HttpException {
  constructor(errors: Record<string, string[]>, message = 'Validation failed.') {
    const response: ValidationErrorResponse = {
      success: false,
      message,
      error_code: ErrorCodes.VALIDATION_ERROR,
      errors,
    };
    super(response, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
