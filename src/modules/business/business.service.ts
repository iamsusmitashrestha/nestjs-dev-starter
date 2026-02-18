import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

export interface OwnershipResult {
  ownerId: string;
}

export interface BusinessSummary {
  id: string;
  name: string;
}

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns ownership info for a business.
   */
  async getOwnership(businessId: string): Promise<OwnershipResult> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });
    if (!business) {
      throw new NotFoundException('Business not found.');
    }
    return { ownerId: business.ownerId };
  }

  /**
   * List businesses by owner.
   */
  async listByOwner(ownerId: string): Promise<BusinessSummary[]> {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    });
    return businesses.map((b) => ({ id: b.id, name: b.name }));
  }
}
