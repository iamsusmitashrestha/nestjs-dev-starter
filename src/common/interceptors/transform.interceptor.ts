import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

/** Handler return shape when controller wants to set message + data (e.g. create/update). */
export interface MessageDataPayload<T> {
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request['requestId'] || 'unknown';

    return next.handle().pipe(
      map((data): ApiResponse<T> => {
        const meta = {
          timestamp: new Date().toISOString(),
          requestId,
        };
        if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
          const { message, data: payload } = data as MessageDataPayload<T>;
          return { success: true, message, data: payload, meta };
        }
        return { success: true, data, meta };
      }),
    );
  }
}
