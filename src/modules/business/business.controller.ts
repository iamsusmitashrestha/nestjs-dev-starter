import { Controller, Get, Param, Query, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusinessService, BusinessSummary, OwnershipResult } from './business.service';

@ApiTags('business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**
   * List businesses by owner.
   * Query param ownerId (required).
   */
  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'List of businesses for the given owner.' })
  async listByOwner(
    @Query('ownerId') ownerId: string | undefined,
  ): Promise<{ message: string; data: BusinessSummary[] }> {
    if (!ownerId?.trim()) {
      throw new BadRequestException('ownerId query parameter is required.');
    }
    const data = await this.businessService.listByOwner(ownerId.trim());
    return { message: 'OK', data };
  }

  /**
   * Get ownership info for a business.
   * validate a user can switch context to this business (owner_id must match).
   */
  @Get(':id/ownership')
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns ownerId for the business.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Business not found.' })
  async getOwnership(@Param('id') id: string): Promise<{ message: string; data: OwnershipResult }> {
    const data = await this.businessService.getOwnership(id);
    return { message: 'OK', data };
  }
}
