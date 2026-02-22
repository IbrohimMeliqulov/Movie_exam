import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { MoviesDto } from './dto/create.dto';

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


    async createMovie(payload: MoviesDto) {

    }
}
