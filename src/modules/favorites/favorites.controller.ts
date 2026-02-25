import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { FavoritesDto, UpdateFavoritesDto } from './dto/favorites.dto';


@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesServices: FavoritesService) { }

    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get()
    getAllFavorites() {

    }


    @ApiOperation({
        summary: `${Role.User},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.User)
    @Get("own")
    getOwnFavorites(
        @Req() req: Request
    ) {
        return this.favoritesServices.getOwnFavorites(req['user'])
    }


    @ApiOperation({
        summary: `${Role.User},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.User)
    @Post()
    createFavorite(
        @Body() payload: FavoritesDto,
        @Req() req: Request
    ) {
        return this.favoritesServices.createFavorite(payload, req['user'])
    }

    @ApiOperation({
        summary: `${Role.User},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.User)
    @Put(":id")
    updateFavorite(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateFavoritesDto,
        @Req() req: Request
    ) {
        return this.favoritesServices.updateFavorites(id, payload, req["user"])
    }

    @ApiOperation({
        summary: `${Role.User},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.User)
    @Delete(":id")
    deleteFavorite(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.favoritesServices.deleteFavorite(id, req["user"])
    }


}
