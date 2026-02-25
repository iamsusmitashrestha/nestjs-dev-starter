import {
  IsString,
  IsOptional,
  IsEmail,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsEnum,
  IsBoolean,
  ValidateIf,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  BusinessEntityType,
  BusinessServiceProviderType,
  BusinessWorkMode,
} from '../business.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OperatingTimeDto } from './operating-time.dto';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimLowerString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class DayOperatingHoursDto {
  @IsBoolean()
  isOpen: boolean;

  @ValidateIf((o) => o.isOpen === true)
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  start?: string;

  @ValidateIf((o) => o.isOpen === true)
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  end?: string;
}

/** Plain interface for the operating hours JSON shape (Prisma-safe). */
export interface OperatingTimeMap {
  [day: string]: {
    isOpen: boolean;
    start?: string;
    end?: string;
  };
}

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty({ message: 'Business name must not be empty.' })
  @MinLength(2, { message: 'Business name must be at least 2 characters.' })
  @MaxLength(200, { message: 'Business name must not exceed 200 characters.' })
  @Transform(trimString)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  @MinLength(10, { message: 'Description must be at least 10 characters.' })
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters.' })
  @Transform(trimString)
  @ApiProperty()
  description: string;

  @IsUUID('4', { message: 'categoryId must be a valid UUID.' })
  @IsOptional()
  @ApiProperty()
  categoryId: string;

  @IsString()
  @IsEnum(BusinessEntityType)
  @ApiProperty()
  entityType: BusinessEntityType;

  @IsString()
  @IsEnum(BusinessWorkMode)
  @ApiProperty()
  workMode: BusinessWorkMode;

  @IsString()
  @IsEnum(BusinessServiceProviderType)
  @ApiProperty()
  serviceProviderType: BusinessServiceProviderType;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address.' })
  @MaxLength(254, { message: 'email must not exceed 254 characters.' })
  @Transform(trimLowerString)
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-().]{6,20}$/, {
    message:
      'phoneNumber must be a valid phone number (6–20 digits, may include +, spaces, dashes, parentheses).',
  })
  @Transform(trimString)
  @ApiProperty()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'country must not exceed 100 characters.' })
  @Transform(trimString)
  @ApiProperty()
  country?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatingTimeDto)
  @ApiPropertyOptional()
  operatingTime?: OperatingTimeDto;

  @IsBoolean()
  @ApiProperty()
  showRatingsReviews: boolean;

  @IsBoolean()
  @ApiProperty()
  showTeamPublicly: boolean;

  @IsBoolean()
  @ApiProperty()
  showHoursOnProfile: boolean;
}
