import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { BusinessContextGuard } from '@common/guards/business-context.guard';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BusinessController],
  providers: [BusinessService, JwtAuthGuard, BusinessContextGuard],
  exports: [BusinessService],
})
export class BusinessModule {}
