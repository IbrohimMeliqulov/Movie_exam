import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MovieFilesService } from './movie_files.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { diskStorage } from 'multer';
import { MovieFilesDto, UpdateMovieFilesDto } from './dto/create.movie-files';


@ApiBearerAuth()
@Controller('movie-files')
export class MovieFilesController {
    constructor(private readonly movieFiles: MovieFilesService) { }

    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get()
    getAllMovieFiles() {
        return this.movieFiles.getAllMovieFiles()
    }





    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                movie_id: { type: "number" },
                language: { type: "string" },
                movie_file: { type: "string", format: 'binary' },
            }
        }
    })
    @UseInterceptors(FileInterceptor("movie_file", {
        storage: diskStorage({
            destination: "./src/uploads/movies",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const videoFormats = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv", "mpeg", "3gp"]

            if (!videoFormats.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Post()
    createMovieFile(
        @Body() payload: MovieFilesDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.movieFiles.createMovieFile(payload, file.path, file.filename)
    }






    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                movie_id: { type: "number" },
                language: { type: "string" },
                movie_file: { type: "string", format: 'binary' },
            }
        }
    })
    @UseInterceptors(FileInterceptor("movie_file", {
        storage: diskStorage({
            destination: "./src/uploads/movies",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const videoFormats = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv", "mpeg", "3gp"]

            if (!videoFormats.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Put(":id")
    updateMovieFiles(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateMovieFilesDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.movieFiles.updateMovieFiles(id, payload, file?.path, file?.filename)
    }




    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Delete(":id")
    deleteMovieFile(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.movieFiles.deleteMovieFile(id)
    }

}
