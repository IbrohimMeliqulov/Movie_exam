import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { ReviewsDto, UpdateReviewsDto } from './dto/create.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async getAllReviews() {
        const reviews = await this.prisma.reviews.findMany({
            where: { status: Status.active }
        })

        return {
            success: true,
            data: reviews
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
        const existReview = await this.prisma.reviews.findUnique({
            where: { id }
        })
        if (!existReview) throw new NotFoundException("Review not found")
        if (payload.movie_id) {
            const existMovie = await this.prisma.movies.findUnique({
                where: { id: payload.movie_id }
            })
            if (!existMovie) throw new NotFoundException("Movie not found")
        }
        if (payload.user_id) {
            const existUser = await this.prisma.users.findUnique({
                where: { id: payload.user_id }
            })
            if (!existUser) throw new NotFoundException("user not found")
            if (existUser.id != current_user.id && existUser.role != current_user.role) {
                throw new ForbiddenException("You don't have  a permission to change")
            }
        }
        const existCurrentUser = await this.prisma.users.findUnique({
            where: { id: current_user.id }
        })
        if (!existCurrentUser) throw new NotFoundException()
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
        const existUser = await this.prisma.reviews.findFirst({
            where: { user_id: current_user.id }
        })
        if (!existUser) throw new NotFoundException("You aren't the user")
        await this.prisma.reviews.update({ where: { id }, data: { status: Status.inactive } })

        return {
            success: true,
            message: "Review deleted"
        }
    }
}
