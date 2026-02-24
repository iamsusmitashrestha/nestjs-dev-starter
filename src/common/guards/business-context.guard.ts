import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '@database/prisma.service';
import { ForbiddenException as AppForbiddenException } from '@common/exceptions/forbidden.exception';
import type { AuthUser, BusinessContext } from '@common/types/express';

const HEADER_BUSINESS_ID = 'x-business-id';
const QUERY_BUSINESS_ID = 'business_id';

/**
 * Reads business context from header x-business-id or query business_id.
 * If absent: personal context (req.businessContext left undefined).
 * If present: validates active membership and sets req.businessContext = { businessId, role }.
 * Requires req.user (use after JwtAuthGuard).
 */
@Injectable()
export class BusinessContextGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const user = request.user;
    if (!user) {
      throw new AppForbiddenException('Authentication required to use business context.');
    }

    const businessId =
      (request.headers[HEADER_BUSINESS_ID] as string)?.trim() ||
      (request.query[QUERY_BUSINESS_ID] as string)?.trim();

    if (!businessId) {
      return true;
    }

    const membership = await this.prisma.businessMembership.findUnique({
      where: {
        businessId_userId: { businessId, userId: user.id },
      },
      select: { role: true, status: true },
    });

    if (!membership) {
      throw new AppForbiddenException('You are not a member of this business.');
    }

    if (membership.status !== 'ACTIVE') {
      throw new AppForbiddenException('Your membership for this business is not active.');
    }

    (request as Request & { businessContext: BusinessContext }).businessContext = {
      businessId,
      role: membership.role,
    };
    return true;
  }
}
