import { Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { ReviewsDto } from './dto/create.dto';

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
}
