import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class MovieCategoriesService {
    constructor(private prisma: PrismaService) { }


    async getAllMoviesCategories() {
        const MoviesCategories = await this.prisma.movie_categories.findMany()

        return {
            success: true,
            data: MoviesCategories
        }
    }

    async getOneMoviesCategory(id: number) {

    }
}
