import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MoviesDto, UpdateMoviesDto } from './dto/create.dto';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';


@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin, Role.User)
    @Get()
    getAllMovies() {
        return this.moviesService.getAllMovies()
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin, Role.User)
    @Get(":id")
    getSingleMovie(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.moviesService.getOneMovie(id, req["user"])
    }


    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                title: { type: "string" },
                description: { type: "string" },
                subscription_type: { type: "string" },
                release_year: { type: "number" },
                duration_minutes: { type: "number" },
                rating: { type: "number" },
                poster: { type: "string", format: 'binary' },
            }
        }
    })
    @UseInterceptors(FileInterceptor("poster", {
        storage: diskStorage({
            destination: "./src/uploads/posters",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
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
    createMovie(
        @Body() payload: MoviesDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        return this.moviesService.createMovie(payload, file.filename, req['user'])
    }




    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                title: { type: "string" },
                description: { type: "string" },
                release_year: { type: "number" },
                subscription_type: { type: "enum" },
                duration_minutes: { type: "number" },
                rating: { type: "number" },
                poster: { type: "string", format: 'binary' },
            }
        }
    })
    @UseInterceptors(FileInterceptor("poster", {
        storage: diskStorage({
            destination: "./src/uploads/posters",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
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
    updateMovie(
        @Body() payload: UpdateMoviesDto,
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.moviesService.updateMovie(id, payload, req['user'], file?.filename)
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Delete(":id")
    deleteMovie(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.moviesService.deleteMovie(id, req["user"])
    }
}
