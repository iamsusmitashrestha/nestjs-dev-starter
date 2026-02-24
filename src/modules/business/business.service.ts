import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma.service';
import { ForbiddenException } from '@common/exceptions/forbidden.exception';
import { ConflictException } from '@common/exceptions/conflict.exception';
import type { AuthUser } from '@common/types/express';
import type { ApiResponse } from '@common/types/api-response';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import type { BusinessSummary, CreateBusinessData } from './business.interfaces';
import {
  BUSINESS_CONTEXT_TYPE,
  BUSINESS_MESSAGES,
  GlobalRole,
  MembershipRole,
  MembershipStatus,
} from './business.constants';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * List businesses the user is a member of (active memberships).
   */
  async findMyBusinesses(userId: string): Promise<ApiResponse<BusinessSummary[]>> {
    const memberships = await this.prisma.businessMembership.findMany({
      where: { userId, status: MembershipStatus.ACTIVE },
      include: { business: { select: { id: true, name: true } } },
    });

    const data: BusinessSummary[] = memberships.map(
      (m: { business: { id: string; name: string } }) => ({
        id: m.business.id,
        name: m.business.name,
      }),
    );

    return { message: BUSINESS_MESSAGES.LIST_OK, data };
  }

  /**
   * Create a business and add the user as OWNER.
   *
   * Post-creation: returns a `contextSwitch` payload the client must forward to Core
   * (POST /auth/switch-context { contextType: 'BUSINESS', contextId: <businessId> })
   * so the JWT session is updated to BUSINESS context.
   */
  async create(userId: string, dto: CreateBusinessDto): Promise<ApiResponse<CreateBusinessData>> {
    await this.validateCategory(dto.categoryId);
    await this.validateBusinessName(userId, dto.name);

    try {
      const business = await this.prisma.business.create({
        data: {
          ownerId: userId,
          name: dto.name,
          description: dto.description,
          categoryId: dto.categoryId,
          entityType: dto.entityType,
          workMode: dto.workMode,
          serviceProviderType: dto.serviceProviderType,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          country: dto.country,
          memberships: {
            create: {
              userId,
              role: MembershipRole.OWNER,
              status: MembershipStatus.ACTIVE,
            },
          },
        },
        select: { id: true, name: true },
      });

      this.logger.log(`Business created businessId=${business.id} ownerId=${userId}`);

      const data: CreateBusinessData = {
        id: business.id,
        name: business.name,
        contextSwitch: {
          contextType: BUSINESS_CONTEXT_TYPE,
          contextId: business.id,
        },
      };
      return { message: BUSINESS_MESSAGES.CREATED, data };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a business.
   */
  async update(
    businessId: string,
    user: AuthUser,
    dto: UpdateBusinessDto,
  ): Promise<ApiResponse<BusinessSummary>> {
    const isAuthorized = await this.isUserAuthorizedToUpdateBusiness(user, businessId);
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to update this business.');
    }

    const updated = await this.applyBusinessUpdate(businessId, dto);
    this.logger.log(`Business updated businessId=${businessId} ownerId=${user.id}`);
    return { message: BUSINESS_MESSAGES.UPDATED, data: updated };
  }

  /**
   * Returns ownership info for a business (for backward-compat / internal use).
   */
  async getOwnership(businessId: string): Promise<ApiResponse<{ ownerId: string }>> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });
    if (!business) {
      throw new NotFoundException('Business not found.');
    }
    return { message: BUSINESS_MESSAGES.OWNERSHIP_OK, data: { ownerId: business.ownerId } };
  }

  /**
   * List businesses by ownerId (backward compat; prefer GET /business/me with JWT).
   */
  async listByOwner(ownerId: string): Promise<ApiResponse<BusinessSummary[]>> {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    });
    const data: BusinessSummary[] = businesses.map((b) => ({ id: b.id, name: b.name }));
    return { message: BUSINESS_MESSAGES.LIST_BY_OWNER_OK, data };
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private async validateCategory(categoryId: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException(`Category '${categoryId}' does not exist.`);
    }
  }

  private async validateBusinessName(userId: string, name: string): Promise<void> {
    const existing = await this.prisma.business.findFirst({
      where: { ownerId: userId, name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(
        `You already have a business named '${name}'. Please choose a different name.`,
      );
    }
  }

  /** Builds the Prisma update data object from an UpdateBusinessDto */
  private buildUpdateData(dto: UpdateBusinessDto): Prisma.BusinessUpdateInput {
    return {
      name: dto?.name,
      description: dto?.description,
      email: dto?.email,
      phoneNumber: dto?.phoneNumber,
      isOpen: dto?.isOpen,
    };
  }

  private async applyBusinessUpdate(
    businessId: string,
    dto: UpdateBusinessDto,
  ): Promise<BusinessSummary> {
    const updated = await this.prisma.business.update({
      where: { id: businessId },
      data: this.buildUpdateData(dto),
      select: { id: true, name: true },
    });
    return { id: updated.id, name: updated.name };
  }

  private async isUserAuthorizedToUpdateBusiness(
    user: AuthUser,
    businessId: string,
  ): Promise<boolean> {
    // Fetch user role
    const { data: userRole } = await this.getUserRoleByBusinessId(businessId, user.id);

    if (
      userRole.role === MembershipRole.OWNER ||
      userRole.role === GlobalRole.ADMIN ||
      user.globalRole === GlobalRole.SUPERADMIN
    ) {
      return true;
    }

    return false;
  }

  //Fetch user role by businessId
  async getUserRoleByBusinessId(
    businessId: string,
    userId: string,
  ): Promise<ApiResponse<{ role: string }>> {
    const membership = await this.prisma.businessMembership.findUnique({
      where: { businessId_userId: { businessId, userId } },
      select: { role: true, status: true },
    });

    if (!membership || membership.status !== MembershipStatus.ACTIVE) {
      throw new ForbiddenException('You are not an active member of this business.');
    }
    return { message: 'OK', data: { role: membership.role } };
  }
}
