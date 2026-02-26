import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateUserSubscriptionDto, UserSubscriptionsDto } from './dto/create.dto';
import { Role, Status } from '@prisma/client';
import { useContainer } from 'class-validator';

@Injectable()
export class UserSubscriptionsService {
    constructor(private prisma: PrismaService) { }


    async getAllUserSubscriptions() {
        const userSubscriptions = await this.prisma.user_subscriptions.findMany({
            where: { status: Status.active }
        })

        return {
            success: true,
            data: userSubscriptions
        }
    }



    async getOwnSubscription(current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id: current_user.id,
                role: current_user.role,
                status: Status.active
            }
        })
        if (!existUser) throw new NotFoundException("User not found")
        const existSubscription = await this.prisma.user_subscriptions.findMany({
            where: {
                user_id: current_user.id,
                status: Status.active
            },
            select: {
                id: true,
                status: true,
                start_date: true,
                auto_renew: true,
                end_date: true,
                plans: {
                    select: {
                        name: true,
                        price: true,
                        duration_days: true,
                        features: true
                    }
                }
            }
        })
        if (!existSubscription) throw new NotFoundException("Subscription not found")
        return {
            success: true,
            data: existSubscription.map(item => ({
                id: item.id,
                status: item.status,
                auto_renew: item.auto_renew,
                start_date: item.start_date.toISOString().split('T')[0],
                end_date: item.end_date.toISOString().split('T')[0],
                plan: item.plans
            }))
        }
    }




    async createUserSubscription(payload: UserSubscriptionsDto) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id: payload.user_id,
                status: Status.active
            }
        })
        if (!existUser) throw new NotFoundException("User not found")

        const existSubscription = await this.prisma.subscription_plans.findUnique({
            where: {
                id: payload.plan_id,
                status: Status.active
            }
        })
        if (!existSubscription) throw new NotFoundException("Subscription not found")
        const start_date = new Date()

        const end_date = new Date(start_date)
        end_date.setDate(end_date.getDate() + existSubscription.duration_days)
        await this.prisma.user_subscriptions.create({
            data:
            {
                user_id: payload.user_id,
                plan_id: payload.plan_id,
                start_date,
                end_date
            }
        })

        return {
            success: true,
            message: "You subscribed successfully"
        }
    }

    async updateUserSubscription(id: number, payload: UpdateUserSubscriptionDto, current_user: { id: number, role: Role }) {
        const existUserSubscription = await this.prisma.user_subscriptions.findFirst({
            where: {
                id,
                user_id: current_user.id,
                status: Status.active
            }
        })

        if (!existUserSubscription) throw new NotFoundException("User subscription not found")

        await this.prisma.user_subscriptions.update({
            where: { id },
            data: {
                ...payload,

            }
        })
        return {
            success: true,
            message: "Updated successfully"
        }
    }


    async deleteUserSubscription(id: number, current_user: { id: number, role: Role }) {
        const existUserSubscription = await this.prisma.user_subscriptions.findUnique({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existUserSubscription) throw new NotFoundException("Usersubscription not found")

        if (current_user.role !== Role.Superadmin && existUserSubscription.user_id !== current_user.id) {
            throw new ForbiddenException("You don't have permission to delete this subscription")
        }

        await this.prisma.user_subscriptions.update({
            where: { id }, data: { status: Status.inactive }
        })
        return {
            success: true,
            message: "Subscription deleted"
        }
    }
}
