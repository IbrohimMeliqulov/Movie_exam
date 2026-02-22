import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateUserSubscriptionsDto, UserSubscriptionsDto } from './dto/create.dto';
import { Role } from '@prisma/client';
import { useContainer } from 'class-validator';

@Injectable()
export class UserSubscriptionsService {
    constructor(private prisma: PrismaService) { }


    async getAllUserSubscriptions() {
        const userSubscriptions = await this.prisma.user_subscriptions.findMany()

        return {
            success: true,
            data: userSubscriptions
        }
    }

    async getOwnSubscription(id: number, current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id: current_user.id,
                role: current_user.role
            }
        })
        if (!existUser) throw new NotFoundException("User not found")
        const existSubscription = await this.prisma.user_subscriptions.findUnique({
            where: { id },
            select: {
                status: true,
                start_date: true,
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
            data: existSubscription
        }
    }


    async createUserSubscription(payload: UserSubscriptionsDto) {
        const existUser = await this.prisma.users.findUnique({
            where: { id: payload.user_id }
        })
        if (!existUser) throw new NotFoundException("User not found")

        const existSubscription = await this.prisma.subscription_plans.findUnique({
            where: { id: payload.plan_id }
        })
        if (!existSubscription) throw new NotFoundException("Subscription not found")
        const start_date = new Date(payload.start_date)

        const end_date = new Date(start_date)
        end_date.setDate(end_date.getDate() + existSubscription.duration_days)
        await this.prisma.user_subscriptions.create({
            data:
            {
                ...payload,
                start_date,
                end_date
            }
        })

        return {
            success: true,
            message: "You subscribed successfully"
        }
    }

    async updateUserSubscription(id: number, payload: UpdateUserSubscriptionsDto, current_user: { id: number, role: Role }) {
        const existUserSubscription = await this.prisma.user_subscriptions.findUnique({
            where: {
                id,
                user_id: current_user.id
            }
        })

        if (!existUserSubscription) throw new NotFoundException("User subscription not found")

        if (payload.user_id) {
            const existUser = await this.prisma.users.findUnique({
                where: { id }
            })
            if (!existUser) throw new NotFoundException("User not found")
        }
        let end_date = existUserSubscription.end_date

        if (payload.plan_id) {
            const existSubscription = await this.prisma.subscription_plans.findUnique({
                where: {
                    id
                }
            })
            if (!existSubscription) throw new NotFoundException("Subscription not found")
            const start_date = existUserSubscription.start_date
            end_date = new Date(start_date)
            end_date.setDate(end_date.getDate() + existSubscription.duration_days)
        }
        if (current_user.role !== Role.Superadmin && existUserSubscription.user_id !== current_user.id) {
            throw new ForbiddenException("You don't have permission to update this subscription")
        }

        await this.prisma.user_subscriptions.update({
            where: { id },
            data: {
                ...payload,
                end_date
            }
        })
        return {
            success: true,
            message: "Updated successfully"
        }
    }


    async deleteUserSubscriptions(id: number, current_user: { id: number, role: Role }) {
        const existUserSubscription = await this.prisma.user_subscriptions.findUnique({
            where: {
                id,

            }
        })
        if (!existUserSubscription) throw new NotFoundException("Usersubscription not found")

        if (current_user.role !== Role.Superadmin && existUserSubscription.user_id !== current_user.id) {
            throw new ForbiddenException("You don't have permission to delete this subscription")
        }

        await this.prisma.user_subscriptions.delete({
            where: { id }
        })
        return {
            success: true,
            message: "User subscription deleted"
        }
    }
}
