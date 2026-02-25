import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { FavoritesDto, UpdateFavoritesDto } from './dto/favorites.dto';

@Injectable()
export class FavoritesService {
    constructor(private prisma: PrismaService) { }


    async getAllFavorites() {
        const favorites = await this.prisma.favorites.findMany({
            where: { status: Status.active },
            select: {
                movies: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        poster_url: true,
                        release_year: true,
                        rating: true,
                        subscription_type: true
                    }
                }
            }
        })

        return {
            success: true,
            data: favorites
        }
    }


    async getOwnFavorites(current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findFirst({
            where: {
                id: current_user.id,
                role: current_user.role
            }
        })
        if (!existUser) throw new NotFoundException("User not found")

        const existFavorite = await this.prisma.favorites.findMany({
            where: { user_id: current_user.id },
            select: {
                movies: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        release_year: true,
                        rating: true,
                        subscription_type: true
                    }
                }
            }
        })
        if (!existFavorite) throw new NotFoundException("Your favorite movie not found")

        return {
            success: true,
            data: existFavorite
        }
    }


    async createFavorite(payload: FavoritesDto, current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findFirst({
            where: {
                id: current_user.id,
                role: current_user.role
            }
        })
        if (!existUser) throw new NotFoundException("user not found")
        const existMovie = await this.prisma.movies.findUnique({
            where: { id: payload.movie_id }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")
        await this.prisma.favorites.create({
            data: {
                ...payload,
                user_id: current_user.id
            }
        })

        return {
            success: true,
            message: "Movie added to favorites"
        }
    }


    async updateFavorites(id: number, payload: UpdateFavoritesDto, current_user: { id: number, role: Role }) {
        const existFavorite = await this.prisma.favorites.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existFavorite) throw new NotFoundException("Favorite not found")
        const existUser = await this.prisma.users.findFirst({
            where: {
                id: current_user.id,
                role: current_user.role
            }
        })
        if (!existUser) throw new NotFoundException("user not found")
        if (existUser.id != current_user.id && existUser.role != current_user.role) {
            throw new ForbiddenException("You don't have a permission")
        }
        const existMovie = await this.prisma.movies.findUnique({
            where: { id: payload.movie_id }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")
        await this.prisma.favorites.update({
            where: { id },
            data: payload
        })

        return {
            success: true,
            message: "Your favorites updated"
        }
    }


    async deleteFavorite(id: number, current_user: { id: number, role: Role }) {
        const existFavorite = await this.prisma.favorites.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existFavorite) throw new NotFoundException("Favorite not found")
        const existUser = await this.prisma.users.findFirst({
            where: {
                id: current_user.id,
                status: Status.active
            }
        })
        if (!existUser) throw new NotFoundException("User not found")
        await this.prisma.favorites.update({
            where: { id },
            data: { status: Status.inactive }
        })
        return {
            success: true,
            message: "favorites deleted"
        }
    }
}
