import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { SubscriptionPlansDto, UpdateSubscriptionPlansDto } from './dto/create.dto';

@Injectable()
export class SubscriptionPlansService {
    constructor(private prisma: PrismaService) { }

    async getAllSubscriptions() {
        const subscriptions = await this.prisma.subscription_plans.findMany()
        return {
            success: true,
            data: subscriptions
        }
    }


    async createSubscription(payload: SubscriptionPlansDto) {
        await this.prisma.subscription_plans.create({
            data: payload
        })

        return {
            success: true,
            message: "Subscription created"
        }
    }


    async updateSubscriptio(id: number, payload: UpdateSubscriptionPlansDto) {
        const existSubscription = await this.prisma.subscription_plans.findUnique({
            where: { id }
        })
        if (!existSubscription) throw new NotFoundException("Subscription not found")
        await this.prisma.subscription_plans.update({
            where: { id }, data: payload
        })
    }
}
