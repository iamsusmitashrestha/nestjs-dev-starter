import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorizedException as AppUnauthorizedException } from '@common/exceptions/unauthorized.exception';
import type { AuthUser, GlobalRole } from '@common/types/express';

const BEARER_PREFIX = 'Bearer ';

/** JWT payload shape from Core (sub, email, role). */
interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
}

/**
 * Verifies Bearer token issued by Core and sets req.user.
 * Use on routes that require authentication.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers?.authorization;
    const token =
      typeof authHeader === 'string' && authHeader.startsWith(BEARER_PREFIX)
        ? authHeader.slice(BEARER_PREFIX.length).trim()
        : undefined;

    if (!token) {
      throw new AppUnauthorizedException('Missing or invalid authorization header.');
    }

    const secret = this.configService.get<string>('jwt.accessSecret');
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured; cannot verify tokens.');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, { secret });
      const globalRole: GlobalRole =
        payload.role === 'ADMIN' || payload.role === 'SUPERADMIN'
          ? (payload.role as GlobalRole)
          : 'USER';

      (request as Request & { user: AuthUser }).user = {
        id: payload.sub,
        email: payload.email,
        globalRole,
      };
      return true;
    } catch {
      throw new AppUnauthorizedException('Invalid or expired token.');
    }
  }
}
