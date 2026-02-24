import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponse as SwaggerApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthUser } from '@common/types/express';
import type { ApiResponse } from '@common/types/api-response';
import { BusinessService } from './business.service';
import type { BusinessSummary, CreateBusinessData } from './business.interfaces';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessContextGuard } from '@/common/guards/business-context.guard';

@ApiTags('business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**
   * List my businesses (active memberships).
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'List of businesses for the current user.',
  })
  @SwaggerApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authenticated.' })
  findMyBusinesses(@CurrentUser() user: AuthUser): Promise<ApiResponse<BusinessSummary[]>> {
    return this.businessService.findMyBusinesses(user.id);
  }

  /**
   * Create a business.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @SwaggerApiResponse({ status: HttpStatus.CREATED, description: 'Business created.' })
  @SwaggerApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authenticated.' })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateBusinessDto,
  ): Promise<ApiResponse<CreateBusinessData>> {
    return this.businessService.create(user.id, dto);
  }

  /**
   * Update business. Admin override OR OWNER with x-business-id header set to :id.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, BusinessContextGuard)
  @ApiBearerAuth()
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Business updated.' })
  @SwaggerApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not owner or admin.' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateBusinessDto,
  ): Promise<ApiResponse<BusinessSummary>> {
    return this.businessService.update(id, user, dto);
  }

  /**
   * List businesses by ownerId (backward compat).
   */
  @Get()
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'List of businesses for the given owner.',
  })
  listByOwner(
    @Query('ownerId') ownerId: string | undefined,
  ): Promise<ApiResponse<BusinessSummary[]>> {
    if (!ownerId?.trim()) {
      throw new BadRequestException('ownerId query parameter is required.');
    }
    return this.businessService.listByOwner(ownerId.trim());
  }

  /**
   * Get ownership info for a business.
   */
  @Get(':id/ownership')
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Returns ownerId for the business.' })
  @SwaggerApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Business not found.' })
  getOwnership(@Param('id') id: string): Promise<ApiResponse<{ ownerId: string }>> {
    return this.businessService.getOwnership(id);
  }

  // Fetch user role by businessId
  @Get(':id/role')
  @UseGuards(JwtAuthGuard, BusinessContextGuard)
  @ApiBearerAuth()
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Returns role for the business.' })
  @SwaggerApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Business not found.' })
  getRole(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<{ role: string }>> {
    return this.businessService.getUserRoleByBusinessId(id, user.id);
  }
}
