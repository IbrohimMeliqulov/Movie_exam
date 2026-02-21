import { Module } from '@nestjs/common';
import { SubscriptionPlansController } from './subscription_plans.controller';
import { SubscriptionPlansService } from './subscription_plans.service';

@Module({
  controllers: [SubscriptionPlansController],
  providers: [SubscriptionPlansService]
})
export class SubscriptionPlansModule {}
