import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '@common/types/api-response';

/** Full HTTP response envelope (wraps service ApiResponse<T> with success + meta). */
interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiEnvelope<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = (request['requestId'] as string) || 'unknown';

    return next.handle().pipe(
      map((payload): ApiEnvelope<T> => {
        const meta = { timestamp: new Date().toISOString(), requestId };

        if (payload && typeof payload === 'object' && 'message' in payload && 'data' in payload) {
          const { message, data } = payload as ApiResponse<T>;
          return { success: true, message, data, meta };
        }

        return { success: true, data: payload as T, meta };
      }),
    );
  }
}
