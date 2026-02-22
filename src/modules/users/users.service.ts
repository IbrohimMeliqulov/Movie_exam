import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
                role: Role.User
            },
            select: {
                id: true,
                username: true,
                email: true,
                avatar_url: true
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
                role: Role.Admin
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




    async updateUser(id: number, payload: UpdateUserDto, filename: string) {
        const { password, ...rest } = payload
        const existUser = await this.prisma.users.findUnique({
            where: {
                id,
                role: Role.User
            }
        })
        if (!existUser) throw new NotFoundException("User not found with this id")

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


    async deleteUser(id: number) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id,
                role: Role.Admin
            }
        })

        if (!existUser) throw new NotFoundException("User not found")
        await this.prisma.users.delete({ where: { id } })

        return {
            success: true,
            message: "User deleted successfully"
        }
    }
}
