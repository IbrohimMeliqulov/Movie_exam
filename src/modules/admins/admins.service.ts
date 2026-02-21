import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/create.admin.dto';
import { Role } from '@prisma/client';
import { hashPassword } from 'src/core/utils/bcrypt';

@Injectable()
export class AdminsService {
    constructor(private prisma: PrismaService) { }


    async getAllAdmins() {
        const admins = await this.prisma.users.findMany({
            where: {
                role: Role.Admin
            }
        })
        return {
            success: true,
            data: admins
        }
    }


    async getSingleAdmin(id: number) {
        const existAdmin = await this.prisma.users.findUnique({
            where: {
                id,
                role: Role.Admin
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
                    { password: payload.password }
                ]
            }
        })

        if (existAdmin) throw new ConflictException("Admin already exists")
        this.prisma.users.create({
            data: {
                ...payload,
                avatar_url: filename,
                role: Role.Admin
            }
        })

        return {
            success: true,
            message: "Admin created successfully"
        }
    }



    async updateAdmin(id: number, payload: UpdateAdminDto, filename: string) {
        const { password, ...rest } = payload
        const existAdmin = await this.prisma.users.findUnique({
            where: { id }
        })
        if (!existAdmin) throw new NotFoundException("Admin not foun with this id")

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
        const existAdmin = await this.prisma.users.findUnique({
            where: {
                id,
                role: Role.Admin
            }
        })

        if (!existAdmin) throw new NotFoundException("Admin not found")
        await this.prisma.users.update({ where: { id }, data: { role: Role.User } })

        return {
            success: true,
            message: "Admin deleted successfully"
        }
    }
}
