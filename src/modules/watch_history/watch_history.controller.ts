import { Controller, UseGuards } from '@nestjs/common';
import { WatchHistoryService } from './watch_history.service';
import { ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('watch-history')
export class WatchHistoryController {
    constructor(private readonly watchhistoryService: WatchHistoryService) { }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin, Role.User)
    getAllWatchHistories() { }
}
