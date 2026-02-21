import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateProfileDto, UpdateProfileDto } from './dto/create.dto';


@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profileService: ProfilesService) { }

    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin, Role.Superadmin)
    @Get(":id")
    getProfile(
        @Req() req: Request
    ) {
        return this.profileService.getProfile(req["user"])
    }


    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin, Role.Superadmin)
    @Post()
    createProfile(
        @Body() payload: CreateProfileDto,
        @Req() req: Request
    ) {
        return this.profileService.createProfile(payload, req["user"])
    }


    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin, Role.Superadmin)
    @Put(":id")
    updateProfile(
        @Body() payload: UpdateProfileDto,
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.profileService.updateProfile(payload, id, req["user"])
    }


    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin, Role.User)
    @Delete(":id")
    deleteProfile(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.profileService.deleteProfile(id, req["user"])
    }

}
