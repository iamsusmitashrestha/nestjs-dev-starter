import { IsOptional, ValidateNested, IsBoolean, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { DayOperatingHoursDto } from './create-business.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO that explicitly lists each day of the week. This satisfies NestJS's
 * `whitelist` validation (unknown properties are rejected) while still
 * allowing the client to provide any subset of days.
 */
export class OperatingTimeDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DayOperatingHoursDto)
  @ApiProperty({ type: () => DayOperatingHoursDto, required: false })
  mon?: DayOperatingHoursDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayOperatingHoursDto)
  @ApiProperty({ type: () => DayOperatingHoursDto, required: false })
  tue?: DayOperatingHoursDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayOperatingHoursDto)
  @ApiProperty({ type: () => DayOperatingHoursDto, required: false })
  wed?: DayOperatingHoursDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayOperatingHoursDto)
  @ApiProperty({ type: () => DayOperatingHoursDto, required: false })
  thu?: DayOperatingHoursDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayOperatingHoursDto)
  @ApiProperty({ type: () => DayOperatingHoursDto, required: false })
  fri?: DayOperatingHoursDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayOperatingHoursDto)
  @ApiProperty({ type: () => DayOperatingHoursDto, required: false })
  sat?: DayOperatingHoursDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayOperatingHoursDto)
  @ApiProperty({ type: () => DayOperatingHoursDto, required: false })
  sun?: DayOperatingHoursDto;
}
