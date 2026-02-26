import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateUserSubscriptionDto, UserSubscriptionsDto } from './dto/create.dto';

@ApiBearerAuth()
@Controller('user-subscriptions')
export class UserSubscriptionsController {
    constructor(private readonly userSubscriptions: UserSubscriptionsService) { }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin)
    @Get()
    getAllUsers() {
        return this.userSubscriptions.getAllUserSubscriptions()
    }

    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin)
    @Get("inactive")
    getInactiveSubscriptions() {
        return this.userSubscriptions.getInactiveSubscriptions()
    }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin, Role.User)
    @Get("own")
    getOwnSubscription(
        @Req() req: Request) {
        return this.userSubscriptions.getOwnSubscription(req["user"])
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin, Role.User)
    @Post()
    createUserSubscription(
        @Body() payload: UserSubscriptionsDto,
        @Req() req: Request
    ) {
        return this.userSubscriptions.createUserSubscription(payload, req['user'])
    }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin, Role.User)
    @Put(":id")
    updateUserSubscription(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateUserSubscriptionDto,
        @Req() req: Request
    ) {
        return this.userSubscriptions.updateUserSubscription(id, payload, req["user"])
    }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin, Role.User)
    @Delete(":id")
    deleteUserSubscription(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.userSubscriptions.deleteUserSubscription(id, req["user"])
    }

}
