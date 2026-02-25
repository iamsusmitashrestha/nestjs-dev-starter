import { IsString, IsOptional, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { trimString } from '@/common/utils/string';

export class LocationDto {
  @IsString()
  @MaxLength(255, { message: 'address must not exceed 255 characters.' })
  @Transform(trimString)
  @ApiProperty({ description: 'Display address, e.g. "NSW, Sydney"' })
  address: string;

  /**
   * Latitude from the map pin (-90 to 90).
   */
  @IsOptional()
  @IsNumber({}, { message: 'latitude must be a number.' })
  @Min(-90, { message: 'latitude must be >= -90.' })
  @Max(90, { message: 'latitude must be <= 90.' })
  @ApiPropertyOptional({ example: -33.8688 })
  latitude?: number;

  /**
   * Longitude from the map pin (-180 to 180).
   */
  @IsOptional()
  @IsNumber({}, { message: 'longitude must be a number.' })
  @Min(-180, { message: 'longitude must be >= -180.' })
  @Max(180, { message: 'longitude must be <= 180.' })
  @ApiPropertyOptional({ example: 151.2093 })
  longitude?: number;
}
