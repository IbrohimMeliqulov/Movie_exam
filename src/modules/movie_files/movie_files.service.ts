import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { MovieFilesDto, UpdateMovieFilesDto } from './dto/create.movie-files';
import { detectionQuality } from 'src/core/utils/videoStream';
import { Quality, Status } from '@prisma/client';

@Injectable()
export class MovieFilesService {
    constructor(private prisma: PrismaService) { }

    async getAllMovieFiles() {
        const movieFiles = await this.prisma.movie_files.findMany({
            where: {
                status: Status.active
            }, select: {
                id: true,
                quality: true,
                language: true,
                movies: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,

                    }
                }
            }
        })

        return {
            success: true,
            data: movieFiles
        }
    }


    async getOneMovieFile(id: number) {
        const existMovieFile = await this.prisma.movie_files.findFirst({
            where: {
                id,
                status: Status.active
            },
            select: {
                id: true,
                quality: true,
                language: true,
                movies: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,

                    }
                }
            }
        })
        if (!existMovieFile) throw new NotFoundException("Movie file not found")

        return {
            success: true,
            data: existMovieFile
        }
    }



    async createMovieFile(payload: MovieFilesDto, path: string, filename: string) {
        const quality = await detectionQuality(path)

        const existMovie = await this.prisma.movies.findFirst({
            where: {
                id: payload.movie_id,
                status: Status.active
            }
        })
        if (!existMovie) throw new NotFoundException("Movie not found")
        await this.prisma.movie_files.create({
            data: {
                ...payload,
                quality: quality,
                file_url: filename
            }
        })

        return {
            success: true,
            message: "Movie file uploaded"
        }
    }


    async updateMovieFiles(id: number, payload: UpdateMovieFilesDto, path?: string, filename?: string) {
        const existMovieFile = await this.prisma.movie_files.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existMovieFile) throw new NotFoundException("Movie File not found")

        if (payload.movie_id) {
            const existMovie = await this.prisma.movies.findFirst({
                where: {
                    id: payload.movie_id,
                    status: Status.active
                }
            })
            if (!existMovie) throw new NotFoundException("Movie not found with this id")
        }

        let quality: Quality | undefined = undefined

        if (path) {
            quality = await detectionQuality(path)
        }

        await this.prisma.movie_files.update({
            where: { id },
            data: {
                ...payload,
                ...(filename && { file_url: filename }),
                ...(quality && { quality: quality })

            }
        })

        return {
            success: true,
            message: "Movie file updated"
        }
    }




    async deleteMovieFile(id: number) {
        const existMovieFile = await this.prisma.movie_files.findFirst({
            where: {
                id,
                status: Status.active
            }
        })

        if (!existMovieFile) throw new NotFoundException("Movie file not found")

        await this.prisma.movie_files.update({
            where: { id },
            data: { status: Status.inactive }
        })

        return {
            success: true,
            message: "Movie file deleted"
        }
    }

}
