import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

type RequestWithId = Request & { requestId?: string };

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  }
}
