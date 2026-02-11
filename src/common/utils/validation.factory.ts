import { ValidationError } from 'class-validator';
import { ValidationException } from '@common/exceptions/validation.exception';

/**
 * Converts class-validator ValidationError[] into our API format
 * and throws ValidationException (422).
 */
export function validationExceptionFactory(errors: ValidationError[]) {
  const errorsMap: Record<string, string[]> = {};

  for (const err of errors) {
    const key = err.property;
    const messages = err.constraints
      ? Object.values(err.constraints)
      : flattenChildErrors(err.children, key);
    if (messages.length) {
      errorsMap[key] = messages;
    }
  }

  throw new ValidationException(errorsMap);
}

function flattenChildErrors(children: ValidationError[] | undefined, parentPath: string): string[] {
  if (!children?.length) return [];
  const messages: string[] = [];
  for (const child of children) {
    const path = `${parentPath}.${child.property}`;
    if (child.constraints) {
      messages.push(...Object.values(child.constraints));
    } else if (child.children?.length) {
      messages.push(...flattenChildErrors(child.children, path));
    }
  }
  return messages;
}
