import { registerAs } from '@nestjs/config';

/**
 * JWT config for verifying tokens issued by Core (NepaliBizzBackend).
 * Use the same JWT_ACCESS_SECRET as Core so this service can verify Bearer tokens.
 */
export default registerAs('jwt', () => ({
  /** Must match Core's JWT_ACCESS_SECRET. */
  accessSecret: process.env.JWT_ACCESS_SECRET,
}));
