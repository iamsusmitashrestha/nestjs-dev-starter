import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ErrorCodes } from '@common/constants/error-codes';

/** Request with optional requestId set by RequestIdMiddleware */
type RequestWithId = Request & { requestId?: string };

interface ApiErrorResponse {
  success: false;
  message: string;
  error_code: string;
  errors?: Record<string, string[]>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();
    const requestId = request.requestId ?? 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: ApiErrorResponse = {
      success: false,
      message: 'Something went wrong. Please try again later.',
      error_code: ErrorCodes.SERVER_ERROR,
    };

    // Custom API exceptions (ValidationException, ConflictException, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null && 'error_code' in res) {
        body = {
          success: false,
          message: (res as ApiErrorResponse).message,
          error_code: (res as ApiErrorResponse).error_code,
          ...((res as ApiErrorResponse).errors && {
            errors: (res as ApiErrorResponse).errors,
          }),
        };
      } else {
        const message = typeof res === 'string' ? res : (res as { message?: string }).message;
        body = {
          success: false,
          message: Array.isArray(message) ? message[0] : message || 'Request failed.',
          error_code: ErrorCodes.BAD_REQUEST,
        };
      }
    }
    // Prisma errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        body = {
          success: false,
          message: 'A record with this value already exists.',
          error_code: ErrorCodes.BAD_REQUEST,
        };
      } else {
        status = this.handlePrismaStatus(exception);
        body = {
          success: false,
          message: this.getPrismaErrorMessage(exception),
          error_code: ErrorCodes.BAD_REQUEST,
        };
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      body = {
        success: false,
        message: 'Validation failed.',
        error_code: ErrorCodes.VALIDATION_ERROR,
      };
    }
    // Unknown errors → 500 with generic message
    else if (exception instanceof Error) {
      body.message = 'Something went wrong. Please try again later.';
      body.error_code = ErrorCodes.SERVER_ERROR;
    }

    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - ${status} - ${body.error_code}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(body);
  }

  private handlePrismaStatus(error: Prisma.PrismaClientKnownRequestError): number {
    switch (error.code) {
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      case 'P2003':
      case 'P2014':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getPrismaErrorMessage(error: Prisma.PrismaClientKnownRequestError): string {
    switch (error.code) {
      case 'P2025':
        return 'Record not found.';
      case 'P2003':
        return 'Invalid reference: related record does not exist.';
      case 'P2014':
        return 'Invalid ID provided.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  }
}
