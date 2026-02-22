import { Body, Controller, Post, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MoviesDto } from './dto/create.dto';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }


    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                title: { type: "string" },
                description: { type: "string" },
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
    @Post()
    createMovie(
        @Body() payload: MoviesDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.moviesService.createMovie(payload, file?.filename)
    }
}
