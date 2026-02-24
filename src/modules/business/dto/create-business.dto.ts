import {
  IsString,
  IsOptional,
  IsIn,
  IsEmail,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimLowerString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty({ message: 'Business name must not be empty.' })
  @MinLength(2, { message: 'Business name must be at least 2 characters.' })
  @MaxLength(200, { message: 'Business name must not exceed 200 characters.' })
  @Transform(trimString)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  @MinLength(10, { message: 'Description must be at least 10 characters.' })
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters.' })
  @Transform(trimString)
  description: string;

  @IsUUID('4', { message: 'categoryId must be a valid UUID.' })
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsIn(['COMPANY', 'INDIVIDUAL'], {
    message: "entityType must be 'COMPANY' or 'INDIVIDUAL'.",
  })
  entityType: 'COMPANY' | 'INDIVIDUAL';

  @IsString()
  @IsIn(['ON_SITE', 'REMOTE'], {
    message: "workMode must be 'ON_SITE' or 'REMOTE'.",
  })
  workMode: 'ON_SITE' | 'REMOTE';

  @IsString()
  @IsIn(['BUSINESS_STAFF', 'BUSINESS_OWNER'], {
    message: "serviceProviderType must be 'BUSINESS_STAFF' or 'BUSINESS_OWNER'.",
  })
  serviceProviderType: 'BUSINESS_STAFF' | 'BUSINESS_OWNER';

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address.' })
  @MaxLength(254, { message: 'email must not exceed 254 characters.' })
  @Transform(trimLowerString)
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-().]{6,20}$/, {
    message:
      'phoneNumber must be a valid phone number (6–20 digits, may include +, spaces, dashes, parentheses).',
  })
  @Transform(trimString)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'country must not exceed 100 characters.' })
  @Transform(trimString)
  country?: string;
}
