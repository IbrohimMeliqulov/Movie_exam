import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create.user.dto';
import { Role, Status } from '@prisma/client';
import { hashPassword } from 'src/core/utils/bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(payload: CreateUserDto, filename?: string) {
        const existUser = await this.prisma.users.findFirst({
            where: {
                OR: [
                    { username: payload.username },
                    { email: payload.email }
                ]
            }
        })
        if (existUser) throw new ConflictException("You already registered. Please log in")

        const hashPass = await hashPassword(payload.password)

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
                // password: true
            }
        })

        return {
            success: true,
            data: users
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




    async updateUser(id: number, payload: UpdateUserDto, filename: string, current_user: { id: number, role: Role }) {
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
