/** Global platform role (from Core JWT). */
export type GlobalRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

/** Authenticated user from JWT (issued by Core). */
export interface AuthUser {
  id: string;
  email: string;
  globalRole: GlobalRole;
}

/** Business context when x-business-id is present and membership is valid. */
export interface BusinessContext {
  businessId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: AuthUser;
      businessContext?: BusinessContext;
    }
  }
}

export {};
