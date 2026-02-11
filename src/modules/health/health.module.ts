import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [TerminusModule, DatabaseModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
