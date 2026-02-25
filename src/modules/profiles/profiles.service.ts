import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/create.dto';
import { Status } from '@prisma/client';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) { }

    async getAllProfiles() {
        const profiles = await this.prisma.profiles.findMany({
            where: { status: Status.active }
        })

        return {
            success: true,
            data: profiles
        }
    }


    async getProfile(current_user: { id: number, role: string }) {
        const existProfile = await this.prisma.profiles.findFirst({
            where: {
                user_id: current_user.id,
                status: Status.active
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
                id: current_user.id,
                status: Status.active
            }
        })

        if (!existUser) throw new NotFoundException("User not found")
        const existProfile = await this.prisma.profiles.findFirst({
            where: {
                user_id: current_user.id,
                status: Status.active
            }
        })

        if (existProfile) throw new ConflictException("User already has a profile")


        await this.prisma.profiles.create({
            data: {
                ...payload,
                user_id: current_user.id
            }
        })

        return {
            success: true,
            message: "Profile created"
        }
    }


    async updateProfile(payload: UpdateProfileDto, id: number, current_user: { id: number, role: string }) {
        const existProfile = await this.prisma.profiles.findUnique({
            where: {
                id,
                user_id: current_user.id,
                status: Status.active
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
                user_id: current_user.id,
                status: Status.active
            }
        })
        if (!existFile) throw new NotFoundException("Profile not found")

        await this.prisma.profiles.update({ where: { id }, data: { status: Status.inactive } })

        return {
            success: true,
            message: "Profile deleted"
        }
    }
}
