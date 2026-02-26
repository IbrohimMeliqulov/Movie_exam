import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { ReviewsDto, UpdateReviewsDto } from './dto/create.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async getAllReviews(current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findFirst({
            where: {
                id: current_user.id
            }
        })
        if (!existUser) throw new NotFoundException("user not found")
        if (existUser?.role == Role.Admin || existUser?.role == Role.Superadmin) {
            const reviews = await this.prisma.reviews.findMany({
                where: {
                    status: Status.active,
                },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    created_at: true,
                    users: {
                        select: {
                            id: true,
                            username: true,
                        }
                    }, movies: {
                        select: {
                            id: true,
                            title: true,
                            slug: true
                        }
                    }
                }
            })
            return {
                success: true,
                data: reviews
            }

        } else if (existUser?.role == Role.User) {
            const reviews = await this.prisma.reviews.findMany({
                where: {
                    status: Status.active,
                    user_id: existUser.id
                },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    created_at: true,
                    users: {
                        select: {
                            id: true,
                            username: true,
                        }
                    }, movies: {
                        select: {
                            id: true,
                            title: true,
                            slug: true
                        }
                    }
                }
            })
            return {
                success: true,
                data: reviews
            }
        }
    }

    async getOneReview(id: number) {
        const review = await this.prisma.reviews.findUnique({
            where: { id }
        })
        if (!review) throw new NotFoundException("Review not found")

        return {
            success: true,
            data: review
        }
    }

    async createReview(paylaod: ReviewsDto) {
        const existUser = await this.prisma.users.findUnique({
            where: { id: paylaod.user_id }
        })
        if (!existUser) throw new NotFoundException("User not found")

        const existMovie = await this.prisma.movies.findUnique({
            where: { id: paylaod.movie_id }
        })

        if (!existMovie) throw new NotFoundException("Movie not found")

        await this.prisma.reviews.create({
            data: paylaod
        })
        return {
            success: true,
            message: "Review deleted"
        }
    }


    async updateReview(id: number, payload: UpdateReviewsDto, current_user: { id: number, role: Role }) {
        const existReview = await this.prisma.reviews.findFirst({
            where: {
                id,
                status: Status.active
            }
        })

        const existCurrentUser = await this.prisma.users.findUnique({
            where: {
                id: current_user.id,
                role: current_user.role,
                status: Status.active
            }
        })

        if (!existCurrentUser) throw new NotFoundException("Review not found")

        await this.prisma.reviews.update({
            where: { id },
            data: payload
        })
        return {
            success: true,
            message: "Review updated"
        }
    }


    async deleteReview(id: number, current_user: { id: number, role: Role }) {
        const existReview = await this.prisma.reviews.findUnique({
            where: { id }
        })
        if (!existReview) throw new NotFoundException("Review not found")

        const isAdminOrSuperadmin = current_user.role === Role.Admin || current_user.role === Role.Superadmin

        if (!isAdminOrSuperadmin && existReview.user_id !== current_user.id) {
            throw new ForbiddenException("You don't have permission to delete this review")
        }

        await this.prisma.reviews.update({
            where: { id },
            data: { status: Status.inactive }
        })

        return {
            success: true,
            message: "Review deleted"
        }
    }
}
