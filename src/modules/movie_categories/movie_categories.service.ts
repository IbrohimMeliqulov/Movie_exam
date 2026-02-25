import { Body, Injectable, NotFoundException, Req } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { MoviesCategoriesDto, UpdateMoviesCategoriesDto } from './dto/create.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class MovieCategoriesService {
    constructor(private prisma: PrismaService) { }


    async getAllMoviesCategories() {
        const MoviesCategories = await this.prisma.movie_categories.findMany({
            where: { status: Status.active }
        })

        return {
            success: true,
            data: MoviesCategories
        }
    }

    async getOneMoviesCategory(id: number) {
        const existMovieCategory = await this.prisma.movie_categories.findUnique({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existMovieCategory) throw new NotFoundException()

        return {
            success: true,
            data: existMovieCategory
        }
    }


    async createMovieCategory(payload: MoviesCategoriesDto, current_user: { id: number, role: Role }) {

        const existMovie = await this.prisma.movies.findUnique({
            where: {
                id: payload.movie_id,
                status: Status.active
            }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")

        const existCategory = await this.prisma.categories.findUnique({
            where: {
                id: payload.category_id,
                status: Status.active
            }
        })
        if (!existCategory) throw new NotFoundException("")

        await this.prisma.movie_categories.create({
            data: payload
        })
        return {
            success: true,
            message: "Movie category created"
        }
    }


    async updateMovieCategory(id: number, payload: UpdateMoviesCategoriesDto) {
        const existMovieCategory = await this.prisma.movie_categories.findUnique({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existMovieCategory) throw new NotFoundException("Movie category not found")

        if (payload.category_id) {
            const existCategory = await this.prisma.categories.findUnique({
                where: {
                    id,
                    status: Status.active
                }
            })
            if (!existCategory) throw new NotFoundException("category not found")
        }
        if (payload.movie_id) {
            const existMovie = await this.prisma.movies.findUnique({
                where: {
                    id,
                    status: Status.active
                }
            })
            if (!existMovie) throw new NotFoundException("Movie not found")
        }

        await this.prisma.movie_categories.update({
            where: { id },
            data: payload
        })
        return {
            success: true,
            message: "Movie category updated"
        }
    }



    async deleteMoviesCategories(id: number) {
        const existMovieCategory = await this.prisma.movie_categories.findUnique({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existMovieCategory) throw new NotFoundException("Movie category not found")
        await this.prisma.movie_categories.update({
            where: { id }, data: { status: Status.inactive }
        })
        return {
            success: true,
            message: "Movie category deleted"
        }
    }
}
