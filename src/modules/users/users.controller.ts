import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create.user.dto';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }




    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin)
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers()
    }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin, Role.Admin)
    @Get("single/:id")
    getSingleUser(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.userService.getSingleUser(id)
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
    @Post()
    createUser(
        @Body() payload: CreateUserDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.userService.createUser(payload, file?.filename)
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
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User)
    @Put(":id")
    updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateUserDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.userService.updateUser(id, payload, file?.filename)
    }



    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User)
    @Delete(":id")
    deleteAdmin(@Param("id", ParseIntPipe) id: number) {
        return this.userService.deleteUser(id)
    }



}
