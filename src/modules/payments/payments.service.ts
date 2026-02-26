import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { PaymentDto, UpdatePaymentDto } from './dto/create.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async getAllPayments(current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findFirst({
            where: {
                id: current_user.id
            }
        })

        if (!existUser) throw new NotFoundException("user not found")

        if (existUser.role == Role.Admin || existUser.role == Role.Superadmin) {
            const payments = await this.prisma.payments.findMany({
                where: { status: Status.active },
                select: {
                    id: true,
                    user_subscription_id: true,
                    payment_status: true,
                    payment_method: true,
                    payment_details: true,
                    amount: true,
                    status: true,
                    user_subscriptions: {
                        select: {
                            user_id: true
                        }
                    }
                }
            })

            return {
                success: true,
                data: payments
            }
        } else if (existUser.role == Role.User) {
            const subscriptions = await this.prisma.user_subscriptions.findMany({
                where: {
                    user_id: existUser.id,
                    status: Status.active
                },
                include: {
                    payments: true
                }
            })
            const allPayments = subscriptions.flatMap(sub => sub.payments)


            return {
                success: true,
                data: allPayments
            }
        }
    }



    async getSinglePayment(id: number) {
        const payment = await this.prisma.payments.findUnique({
            where: { id },
            select: {
                amount: true,
                user_subscriptions: {
                    select: {
                        start_date: true,
                        end_date: true,
                        plans: {
                            select: {
                                name: true,
                                duration_days: true
                            }
                        }
                    }
                }
            }
        }
        )

        return {
            success: true,
            data: payment
        }
    }



    async createPayment(payload: PaymentDto, current_user: { id: number, role: Role }) {
        const existSubscription = await this.prisma.user_subscriptions.findFirst({
            where: { id: payload.user_subscription_id },
            select: {
                user_id: true,
                plans: {
                    select: {
                        price: true,
                        name: true
                    }
                }
            }
        })

        if (!existSubscription) throw new NotFoundException("You haven't subscribed yet")
        if (existSubscription.user_id != current_user.id) {
            throw new ForbiddenException("You don't have the permission")
        }
        if (payload.amount != existSubscription.plans.price.toNumber()) {
            throw new BadRequestException("Money is not enough to buy the subscription plan")
        }
        await this.prisma.payments.create({
            data: payload
        })

        return {
            success: true,
            message: "Subscription plan successfully bought"
        }
    }



    async updatePayment(id: number, payload: UpdatePaymentDto, current_user: { id: number, role: Role }) {
        if (current_user.role !== Role.Admin && current_user.role !== Role.Superadmin) {
            throw new ForbiddenException("Only admin can update payment status")
        }

        const existPayment = await this.prisma.payments.findUnique({
            where: { id }
        })

        if (!existPayment) throw new NotFoundException("Payment not found")

        await this.prisma.payments.update({
            where: { id },
            data: {
                payment_status: payload.payment_status
            }
        })

        return {
            success: true,
            message: `Payment status updated`
        }
    }


    async deletePayment(id: number, current_user: { id: number, role: Role }) {
        const existPayment = await this.prisma.payments.findUnique({
            where: { id },
            select: {
                user_subscriptions: {
                    select: {
                        user_id: true
                    }
                }
            }
        })
        if (!existPayment) throw new NotFoundException("Payment not found")
        if (existPayment.user_subscriptions.user_id != current_user.id) {
            throw new ForbiddenException("You don't have a permission to delete this payment")
        }
        await this.prisma.payments.delete({
            where: { id }
        })
        return {
            success: true,
            message: "Payment deleted"
        }
    }
}
