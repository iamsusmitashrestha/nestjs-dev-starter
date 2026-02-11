import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const requestId = request['requestId'] || 'unknown';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          this.logger.log(`[${requestId}] ${method} ${url} ${response.statusCode} - ${delay}ms`);
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            `[${requestId}] ${method} ${url} - ${delay}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}
