import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create.user.dto';
import { Role, Status } from '@prisma/client';
import { hashPassword } from 'src/core/utils/bcrypt';
import * as fs from 'fs';
import path, { join } from 'path';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(payload: CreateUserDto, file?: Express.Multer.File) {
        const existUser = await this.prisma.users.findFirst({
            where: {
                username: payload.username,
                // status: Status.active,
            }
        })
        if (existUser) throw new ConflictException("You already registered. Please log in")

        const hashPass = await hashPassword(payload.password)

        let filename: string | undefined
        if (file) {
            filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
            await fs.writeFileSync(join("./src/uploads/photos", filename), file.buffer)
        }
        await this.prisma.users.create({
            data: {
                ...payload,
                password: hashPass,
                avatar_url: filename,
                role: Role.User
            }
        })
        return {
            success: true,
            message: "You registered"
        }
    }




    async getAllUsers() {
        const users = await this.prisma.users.findMany({
            where: {
                role: Role.User,
                status: Status.active
            },
            select: {
                id: true,
                username: true,
                email: true,
                avatar_url: true,
            }
        })

        const results: any[] = []
        for (const user of users) {
            results.push({
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.avatar_url ? `http://localhost:3000/uploads/photos/${user.avatar_url}` : null
            })
        }

        return {
            success: true,
            data: results
        }
    }



    async getSingleUser(id: number) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id,
                role: Role.User,
                status: Status.active
            },
            select: {
                username: true,
                email: true,
                avatar_url: true
            }
        })
        if (!existUser) throw new NotFoundException("Not found ")
        return {
            success: true,
            data: existUser
        }
    }




    async updateUser(id: number, payload: UpdateUserDto, current_user: { id: number, role: Role }, file?: Express.Multer.File) {
        const { password, ...rest } = payload
        const existUser = await this.prisma.users.findUnique({
            where: {
                id,
                role: Role.User,
                status: Status.active
            }
        })
        if (!existUser) throw new NotFoundException("User not found with this id")

        if (existUser.id != current_user.id) throw new ForbiddenException("You don't have a permission")

        let filename: string | undefined

        if (file) {
            filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
            fs.writeFileSync(path.join("./src/uploads/photos", filename), file.buffer)
        }
        if (existUser.avatar_url) {
            const oldPath = path.join("./src/uploads/photos", existUser.avatar_url)
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }
        await this.prisma.users.update({
            where: { id }, data: {
                ...rest,
                ...(password && { password: await hashPassword(password) }),
                ...(filename && { avatar_url: filename })
            }
        })
        return {
            success: true,
            message: "Updated successfully"
        }
    }


    async deleteUser(id: number, current_user: { id: number, role: Role }) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id,
                role: Role.User,
                status: Status.active
            }
        })


        if (!existUser) throw new NotFoundException("User not found")
        if (existUser.id != current_user.id) throw new ForbiddenException("You don't have a permission to delete")
        await this.prisma.users.update({ where: { id }, data: { status: Status.inactive } })

        return {
            success: true,
            message: "User deleted successfully"
        }
    }
}
