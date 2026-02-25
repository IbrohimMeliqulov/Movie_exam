import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role, Status, Subscription_type } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { MoviesDto, UpdateMoviesDto } from './dto/create.dto';
import { slugify } from 'src/core/utils/slugify';
import { Decimal } from '@prisma/client/runtime/client';
import { GetMoviesQueryDto } from './dto/pagination';

@Injectable()
export class MoviesService {
    constructor(private prisma: PrismaService) { }

    async getAllMovies(query: GetMoviesQueryDto, current_user: { id: number, role: Role }) {
        const page = query.page || 1
        const limit = query.limit || 10
        const skip = (page - 1) * limit;

        const where: Prisma.MoviesWhereInput = { status: Status.active }



        const isAdminOrSuperadmin = current_user?.role === Role.Admin || current_user?.role === Role.Superadmin
        if (!isAdminOrSuperadmin) {

            let hasSubscription = false;
            if (current_user) {
                const subscription = await this.prisma.user_subscriptions.findFirst({
                    where: {
                        user_id: current_user.id,
                        status: Status.active,
                        end_date: { gt: new Date() }
                    }
                });

                if (subscription) {
                    hasSubscription = true
                }
            }

            if (!hasSubscription) {
                where.subscription_type = Subscription_type.free
            }


            if (hasSubscription && query.subscription_type) {
                where.subscription_type = query.subscription_type
            }
        }



        if (isAdminOrSuperadmin && query.subscription_type) {
            where.subscription_type = query.subscription_type
        }

        if (query.search) {
            where.title = { contains: query.search, mode: 'insensitive' }

        }

        if (query.category) {
            where.movieCategories = {
                some: {
                    categories: {
                        name: { equals: query.category, mode: 'insensitive' },
                        status: Status.active
                    }
                }
            }
        }

        const movies = await this.prisma.movies.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                slug: true,
                poster_url: true,
                release_year: true,
                rating: true,
                subscription_type: true,
                movieCategories: {
                    where: { status: Status.active },
                    select: {
                        categories: {
                            select: { name: true }
                        }
                    }
                },
                movieFiles: {
                    where: { status: Status.active },
                    select: {
                        file_url: true,
                        quality: true,
                        language: true
                    }
                }
            }
        })

        const total = await this.prisma.movies.count({ where })

        const result = [] as any[]

        for (const movie of movies) {
            const categories: string[] = []

            for (const mc of movie.movieCategories) {
                categories.push(mc.categories?.name || " ")
            }

            result.push({
                id: movie.id,
                title: movie.title,
                slug: movie.slug,
                poster_url: movie.poster_url,
                release_year: movie.release_year,
                rating: movie.rating,
                subscription_type: movie.subscription_type,
                files: movie.movieFiles.map(f => ({
                    url: `http://localhost:3000/uploads/movies/${f.file_url}`,
                    qality: f.quality,
                    language: f.quality
                })),
                categories: categories
            })
        }

        return {
            success: true,
            data: {
                movies: result,
                pagination: {
                    total: total,
                    page: page,
                    limit: limit,
                    pages: Math.ceil(total / limit)
                }
            }
        }
    }



    async getOneMovie(id: number, current_user: { id: number, role: Role }) {
        const existMovie = await this.prisma.movies.findUnique({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")
        const existCreator = await this.prisma.users.findUnique({
            where: {
                id: current_user.id,
                status: Status.active
            }
        })
        if (!existCreator) throw new ForbiddenException("You don't have a permission for that")

        return {
            success: true,
            data: existMovie
        }
    }




    async createMovie(payload: MoviesDto, filename: string, current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id: current_user.id,
                role: current_user.role,
                status: Status.active
            }
        })
        if (!existUser) throw new NotFoundException("User not found")
        const slugTitle = slugify(payload.title)
        await this.prisma.movies.create({
            data: {
                ...payload,
                slug: slugTitle,
                created_by: current_user.id,
                rating: new Decimal(payload.rating),
                poster_url: filename ?? ""
            }
        })

        return {
            success: true,
            message: "Movie created"
        }
    }



    async updateMovie(id: number, payload: UpdateMoviesDto, current_user: { id: number, role: Role }, filename?: string) {
        const existMovie = await this.prisma.movies.findUnique({
            where: {
                id,
                status: Status.active
            },
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
            where: {
                id,
                status: Status.active
            },
            data: {
                ...payload,
                ...(filename && { poster_url: filename })
            }
        })

        return {
            success: true,
            message: "Movie updated"
        }
    }


    async deleteMovie(id: number, current_user: { id: number, role: Role }) {
        const existMovie = await this.prisma.movies.findUnique({
            where: {
                id,
                status: Status.active
            },
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
        await this.prisma.movies.update({
            where: { id, status: Status.active }, data: { status: Status.inactive }
        })
        return {
            success: true,
            message: "Movie deleted"
        }
    }
}
