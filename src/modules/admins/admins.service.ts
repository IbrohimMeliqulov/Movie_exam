import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/create.admin.dto';
import { Role, Status } from '@prisma/client';
import { hashPassword } from 'src/core/utils/bcrypt';

@Injectable()
export class AdminsService {
    constructor(private prisma: PrismaService) { }


    async getAllAdmins() {
        const admins = await this.prisma.users.findMany({
            where: {
                role: Role.Admin,
                status: Status.active
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatar_url: true
            }
        })
        return {
            success: true,
            data: admins
        }
    }

    async getInactiveAdmins() {
        const admins = await this.prisma.users.findMany({
            where: {
                role: Role.Admin,
                status: Status.inactive
            }
        })
        return {
            success: true,
            data: admins
        }
    }


    async getSingleAdmin(id: number) {
        const existAdmin = await this.prisma.users.findFirst({
            where: {
                id,
                role: Role.Admin,
                status: Status.active
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatar_url: true
            }
        })
        if (!existAdmin) throw new NotFoundException("Not found ")
        return {
            success: true,
            data: existAdmin
        }
    }




    async createAdmin(payload: CreateAdminDto, filename: string) {
        const existAdmin = await this.prisma.users.findFirst({
            where: {
                OR: [
                    { username: payload.username },
                    { email: payload.password }
                ]
            }
        })

        if (existAdmin) throw new ConflictException("Admin already exists")

        await this.prisma.users.create({
            data: {
                ...payload,
                avatar_url: filename,
                password: await hashPassword(payload.password),
                role: Role.Admin
            }
        })

        return {
            success: true,
            message: "Admin created successfully"
        }
    }



    async updateAdmin(id: number, payload: UpdateAdminDto, current_user: { id: number, role: Role }, filename: string) {
        const { password, ...rest } = payload
        const existAdmin = await this.prisma.users.findFirst({
            where: {
                id,
                role: Role.Admin,
                status: Status.active
            }
        })
        if (!existAdmin) throw new NotFoundException("Admin not foun with this id")
        if (existAdmin.id != current_user.id) throw new ForbiddenException("You don't have a permission")
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


    async deleteAdmin(id: number) {
        const existAdmin = await this.prisma.users.findFirst({
            where: {
                id,
                role: Role.Admin,
                status: Status.active
            }
        })

        if (!existAdmin) throw new NotFoundException("Admin not found")
        await this.prisma.users.update({ where: { id }, data: { status: Status.inactive } })

        return {
            success: true,
            message: "Admin deleted successfully"
        }
    }
}
