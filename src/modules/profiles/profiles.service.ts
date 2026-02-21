import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/create.dto';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) { }

    async getProfile(current_user: { id: number, role: string }) {
        const existProfile = await this.prisma.profiles.findFirst({
            where: {
                user_id: current_user.id
            },
            select: {
                id: true,
                full_name: true,
                phone: true,
                country: true
            }
        })

        if (!existProfile) throw new NotFoundException("Profile not found")
        return {
            success: true,
            data: existProfile
        }
    }


    async createProfile(payload: CreateProfileDto, current_user: { id: number, role: string }) {
        const existUser = await this.prisma.users.findUnique({
            where: {
                id: current_user.id
            }
        })

        if (!existUser) throw new NotFoundException("User not found")
        const existProfile = await this.prisma.profiles.findFirst({
            where: {
                user_id: current_user.id,
            }
        })

        if (existProfile) throw new NotFoundException("User already has a profile")


        await this.prisma.profiles.create({
            data: {
                ...payload,
                user_id: current_user.id
            }
        })
    }


    async updateProfile(payload: UpdateProfileDto, id: number, current_user: { id: number, role: string }) {
        const existProfile = await this.prisma.profiles.findUnique({
            where: {
                id,
                user_id: current_user.id
            }
        })
        if (!existProfile) throw new NotFoundException("Profile not found")

        await this.prisma.profiles.update({ where: { id }, data: payload })
        return {
            success: true,
            message: "Profile updated successfully"
        }
    }


    async deleteProfile(id: number, current_user: { id: number, role: string }) {
        const existFile = await this.prisma.profiles.findUnique({
            where: {
                id,
                user_id: current_user.id
            }
        })
        if (!existFile) throw new NotFoundException("Profile not found")

        await this.prisma.profiles.delete({ where: { id } })

        return {
            success: true,
            message: "Profile deleted"
        }
    }
}
