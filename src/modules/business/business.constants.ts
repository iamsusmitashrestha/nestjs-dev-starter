/** Business-domain constants. */

export const BUSINESS_CONTEXT_TYPE = 'BUSINESS' as const;

export const MembershipRole = {
  OWNER: 'OWNER',
  STAFF: 'STAFF',
} as const;

export const MembershipStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const BUSINESS_MESSAGES = {
  LIST_OK: 'OK',
  CREATED: 'Business created. Switch context to BUSINESS using the contextSwitch payload.',
  UPDATED: 'Business updated.',
  OWNERSHIP_OK: 'OK',
  LIST_BY_OWNER_OK: 'OK',
} as const;
