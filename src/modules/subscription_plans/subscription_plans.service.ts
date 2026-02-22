import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { SubscriptionPlansDto, UpdateSubscriptionPlansDto } from './dto/create.dto';
import { Prisma } from '@prisma/client';

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


    async updateSubscription(id: number, payload: UpdateSubscriptionPlansDto) {
        const existSubscription = await this.prisma.subscription_plans.findUnique({
            where: { id }
        })
        if (!existSubscription) throw new NotFoundException("Subscription not found")
        await this.prisma.subscription_plans.update({
            where: { id },
            data: {
                name: payload.name ?? existSubscription.name,
                price: payload.price ?? existSubscription.price,
                duration_days: payload.duration_days ?? existSubscription.duration_days,
                features: payload.features !== undefined
                    ? [...(existSubscription.features as string[]), ...payload.features] as Prisma.InputJsonValue
                    : existSubscription.features as Prisma.InputJsonValue,
            }

        })
        return {
            success: true,
            message: "Subscription updated"
        }
    }


    async deleteSubscription(id: number) {
        const existSubscription = await this.prisma.subscription_plans.findUnique({
            where: {
                id
            }
        })

        if (!existSubscription) throw new NotFoundException("Subscription not found")

        await this.prisma.subscription_plans.delete({ where: { id } })
        return {
            success: true,
            message: "Subscription deleted"
        }
    }
}
