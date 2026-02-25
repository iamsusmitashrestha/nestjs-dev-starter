import { Prisma } from '@prisma/client';

/**
 * Converts any serializable value into a Prisma-compatible `InputJsonValue`.
 */
export function toJsonValue(data: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

/**
 * Casts a Prisma `JsonValue` (returned from a Json? field) back to a known typed interface.
 */
export function fromJsonValue<T>(value: Prisma.JsonValue): T {
  return value as unknown as T;
}
