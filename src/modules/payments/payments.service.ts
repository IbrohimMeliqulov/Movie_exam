import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { PaymentDto, UpdatePaymentDto } from './dto/create.dto';
import { Role } from '@prisma/client';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async getAllPayments() {
        const payments = await this.prisma.payments.findMany({
            include: {
                user_subscriptions: {
                    select: {
                        start_date: true,
                        end_date: true,
                        users: {
                            select: {
                                username: true,
                                email: true,

                            }
                        }
                    }
                }
            }
        })

        return {
            success: true,
            data: payments
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
                        end_date: true
                    }, include: {
                        plans: {
                            select: {
                                name: true,
                                duration_days: true
                            }
                        }
                    }
                }
            }
        })

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
        if (payload.amount != existSubscription.plans.price) {
            throw new BadRequestException("Money is not enough to buy the subscription plan")
        }
        await this.prisma.payments.create({
            data: payload
        })
    }



    async updatePayment(id: number, payload: UpdatePaymentDto, current_user: { id: number, role: Role }) {
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
            throw new ForbiddenException("You don't have a permission to update this payment")
        }

        await this.prisma.payments.update({
            where: { id },
            data: payload
        })

        return {
            success: true,
            message: "Payment updated"
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
