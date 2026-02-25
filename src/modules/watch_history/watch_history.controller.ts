import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { WatchHistoryService } from './watch_history.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';


@ApiBearerAuth()
@Controller('watch-history')
export class WatchHistoryController {
    constructor(private readonly watchhistoryService: WatchHistoryService) { }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin, Role.User)
    @Get()
    getAllWatchHistories() {
        return this.watchhistoryService.getAllWatchHistories()
    }


    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User)
    @Get("own")
    getOwnWatchHistories(
        @Req() req: any
    ) {
        return this.watchhistoryService.getOwnWatchHistories(req['user'])
    }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin)
    @Get(":id")
    getOneWatchHistory(
        @Param("id", ParseIntPipe) id: number,

    ) {
        return this.watchhistoryService.getOneWatchHistory(id)
    }





    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User)
    @Delete(":id")
    deleteWatchHistory(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.watchhistoryService.deleteWatchHistory(id, req['user'])
    }

}
