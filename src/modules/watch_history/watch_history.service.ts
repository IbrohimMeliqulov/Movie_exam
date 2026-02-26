import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class WatchHistoryService {
    constructor(private prisma: PrismaService) { }


    async getAllWatchHistories() {
        const histories = await this.prisma.watch_history.findMany({
            where: { status: Status.active },
            select: {
                id: true,
                watched_duration: true,
                watched_percentage: true,
                users: {
                    select: {
                        id: true,
                        username: true
                    }
                }, movies: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        const formattedData = histories.map(history => ({
            ...history,
            watched_percentage: Number(history.watched_percentage)
        }))

        return {
            success: true,
            data: formattedData
        }
    }


    async getOneWatchHistory(id: number) {
        const watch_history = await this.prisma.watch_history.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (!watch_history) throw new NotFoundException("Watch_history not found")

        return {
            success: true,
            data: watch_history
        }
    }

    async getOwnWatchHistories(current_user: { id: number, role: Role }) {
        const userId = Number(current_user.id)
        const existUser = await this.prisma.users.findFirst({
            where: {
                id: userId,
                role: current_user.role as Role,
                status: Status.active
            }
        })
        if (!existUser) throw new NotFoundException("User not found")

        const ownWatchHistories = await this.prisma.watch_history.findMany({
            where: {
                user_id: userId,
                status: Status.active
            }, select: {
                watched_duration: true,
                watched_percentage: true,
                last_watched: true,
                users: {
                    select: {
                        username: true,
                    }
                },
                movies: {
                    select: {
                        title: true,
                        rating: true,
                        release_year: true
                    }
                }
            }
        })
        return {
            success: true,
            data: ownWatchHistories
        }
    }



    async deleteWatchHistory(id: number, current_user: { id: number, role: Role }) {
        const existWatchHistory = await this.prisma.watch_history.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existWatchHistory) throw new NotFoundException("Watch History not found")

        if (existWatchHistory.user_id != current_user.id) {
            throw new ConflictException("You don't have a permission")
        }
        await this.prisma.watch_history.update({
            where: { id }, data: { status: Status.inactive }
        })
        return {
            success: true,
            message: "Watch History deleted"
        }
    }
}
