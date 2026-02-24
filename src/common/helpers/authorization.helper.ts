import type { AuthUser, BusinessContext } from '@common/types/express';
import { ForbiddenException } from '@common/exceptions/forbidden.exception';

export function allowAdminOverride(user: AuthUser): boolean {
  return user.globalRole === 'ADMIN' || user.globalRole === 'SUPERADMIN';
}

export function requireBusinessOwner(context: BusinessContext | undefined): void {
  if (!context) {
    throw new ForbiddenException('Business context is required for this action.');
  }
  if (context.role !== 'OWNER') {
    throw new ForbiddenException('Only the business owner can perform this action.');
  }
}

export function requireBusinessMember(context: BusinessContext | undefined): void {
  if (!context) {
    throw new ForbiddenException('Business context is required for this action.');
  }
}
