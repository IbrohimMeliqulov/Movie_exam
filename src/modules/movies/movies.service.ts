import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { MoviesDto, UpdateMoviesDto } from './dto/create.dto';
import { slugify } from 'src/core/utils/slugify';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class MoviesService {
    constructor(private prisma: PrismaService) { }

    async getAllMovies() {
        const movies = await this.prisma.movies.findMany()

        return {
            success: true,
            data: movies
        }
    }

    async getOneMovie(id: number, current_user: { id: number, role: Role }) {
        const existMovie = await this.prisma.movies.findUnique({
            where: { id }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")
        const existCreator = await this.prisma.users.findUnique({
            where: { id: current_user.id }
        })
        if (!existCreator) throw new ForbiddenException("You don't have a permission for that")

        return {
            success: true,
            data: existMovie
        }
    }


    async createMovie(payload: MoviesDto, filename?: string) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id: payload.created_by
            }
        })
        if (!existUser) throw new NotFoundException("User not found")

        const slugTitle = slugify(payload.title)
        await this.prisma.movies.create({
            data: {
                ...payload,
                slug: slugTitle,
                rating: new Decimal(payload.rating),
                poster_url: filename ?? ""
            }
        })

        return {
            success: true,
            message: "Movie created"
        }
    }

    async updateMovie(id: number, payload: UpdateMoviesDto, current_user: { id: number, role: Role }) {
        const existMovie = await this.prisma.movies.findUnique({
            where: { id },
            select: {
                creaters: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")
        if (existMovie?.creaters.id !== current_user.id && existMovie.creaters.role !== current_user.role) {
            throw new ForbiddenException("You don't have a permission")
        }

        await this.prisma.movies.update({
            where: { id },
            data: payload
        })

        return {
            success: true,
            message: "Movie updated"
        }
    }


    async deleteMovie(id: number, current_user: { id: number, role: Role }) {
        const existMovie = await this.prisma.movies.findUnique({
            where: { id },
            select: {
                creaters: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")

        if (existMovie.creaters.id !== current_user.id && existMovie.creaters.role !== current_user.role) {
            throw new ForbiddenException("You don't have a permission to delete")
        }
        await this.prisma.movies.delete({
            where: { id }
        })
        return {
            success: true,
            message: "Movie deleted"
        }
    }
}
