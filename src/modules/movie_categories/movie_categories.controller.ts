import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MovieCategoriesService } from './movie_categories.service';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { MoviesCategoriesDto, UpdateMoviesCategoriesDto } from './dto/create.dto';


@ApiBearerAuth()
@Controller('movie-categories')
export class MovieCategoriesController {
    constructor(private readonly movieCategories: MovieCategoriesService) { }

    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get()
    getAllMoviesCategories() {
        return this.movieCategories.getAllMoviesCategories()
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get(":id")
    getOneMovieCategory(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.movieCategories.getOneMoviesCategory(id)
    }

    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Post()
    createMovieCategory(
        @Body() payload: MoviesCategoriesDto,
        @Req() req: Request
    ) {
        return this.movieCategories.createMovieCategory(payload, req['user'])
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Put(":id")
    updateMovieCategory(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateMoviesCategoriesDto,
        @Req() req: Request
    ) {
        return this.movieCategories.updateMovieCategory(id, payload)
    }

    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Delete(":id")
    deleteMovieCategory(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.movieCategories.deleteMoviesCategories(id)
    }
} 
