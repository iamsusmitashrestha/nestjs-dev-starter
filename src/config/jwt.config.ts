import { registerAs } from '@nestjs/config';

/**
 * JWT config for verifying tokens issued by Core (NepaliBizzBackend).
 * This service verifies RS256 tokens using Core's public key only.
 * JWT_PRIVATE_KEY is NOT present here — this service never signs tokens.
 */
export default registerAs('jwt', () => ({
  /** Core's RSA public key (PEM) for RS256 token verification. */
  publicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
}));
