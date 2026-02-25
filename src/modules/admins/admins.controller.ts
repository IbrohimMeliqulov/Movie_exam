import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateAdminDto, UpdateAdminDto } from './dto/create.admin.dto';


@ApiBearerAuth()
@Controller('admins')
export class AdminsController {
    constructor(private readonly adminService: AdminsService) { }


    @ApiOperation({
        summary: `${Role.Superadmin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin)
    @Get()
    getAllAdmins() {
        return this.adminService.getAllAdmins()
    }


    @ApiOperation({
        summary: `${Role.Superadmin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin)
    @Get("single/:id")
    getSingleAdmin(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.adminService.getSingleAdmin(id)
    }



    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                avatar: { type: "string", format: 'binary' },
            }
        }
    })
    @UseInterceptors(FileInterceptor("avatar", {
        storage: diskStorage({
            destination: "./src/uploads/photos",
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
        summary: `${Role.Superadmin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin)
    @Post()
    createAdmin(
        @Body() payload: CreateAdminDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log(payload)
        return this.adminService.createAdmin(payload, file?.filename)
    }




    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                avatar: { type: "string", format: 'binary' },
            }
        }
    })
    @UseInterceptors(FileInterceptor("avatar", {
        storage: diskStorage({
            destination: "./src/uploads/photos",
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
        summary: `${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @Put(":id")
    updateAdmin(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateAdminDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        return this.adminService.updateAdmin(id, payload, req['user'], file?.filename)
    }



    @ApiOperation({
        summary: `${Role.Superadmin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin)
    @Delete(":id")
    deleteAdmin(@Param("id", ParseIntPipe) id: number) {
        return this.adminService.deleteAdmin(id)
    }




}
