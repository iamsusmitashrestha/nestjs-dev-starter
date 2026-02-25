import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DayOperatingHoursDto } from './create-business.dto';
import { ApiProperty } from '@nestjs/swagger';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimLowerString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class UpdateBusinessDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Business name must not be empty.' })
  @MinLength(2, { message: 'Business name must be at least 2 characters.' })
  @MaxLength(200, { message: 'Business name must not exceed 200 characters.' })
  @Transform(trimString)
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  @MinLength(10, { message: 'Description must be at least 10 characters.' })
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters.' })
  @Transform(trimString)
  @ApiProperty()
  description?: string;

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
  @IsBoolean({ message: 'isOpen must be a boolean.' })
  isOpen?: boolean;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => DayOperatingHoursDto)
  @ApiProperty()
  operatingTime: Record<string, DayOperatingHoursDto>;

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
