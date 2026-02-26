import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CategoriesDto, UpdateCategoriesDto } from './dto/create.dto';
import { slugify } from 'src/core/utils/slugify';
import { Status } from '@prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async getAllCategories() {
        const categories = await this.prisma.categories.findMany({
            where: { status: Status.active }
        })

        return {
            success: true,
            data: categories
        }
    }

    async getOneCategory(id: number) {
        const existCategory = await this.prisma.categories.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existCategory) throw new NotFoundException("Category not found")
        return {
            success: true,
            data: existCategory
        }
    }

    async createCategory(payload: CategoriesDto) {
        const categorySlug = slugify(payload.name)
        const exists = await this.prisma.categories.findUnique({
            where: {
                slug: categorySlug
            }
        })

        if (exists) {
            throw new ConflictException("Category already exists")
        }

        await this.prisma.categories.create({
            data: {
                ...payload,
                slug: categorySlug
            }
        })

        return {
            success: true,
            message: "Category created"
        }
    }

    async updateCategory(id: number, payload: UpdateCategoriesDto) {
        const existCategory = await this.prisma.categories.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (payload.name) {
            const slug = slugify(payload.name)
            const exists = await this.prisma.categories.findUnique({
                where: { slug }
            })
            if (exists) {
                throw new ConflictException("This category already exists")
            }
        }
        if (!existCategory) throw new NotFoundException("Category not found")

        await this.prisma.categories.update({
            where: { id },
            data: {
                ...payload,
                slug: payload.name ? slugify(payload.name) : existCategory.slug
            }
        })

        return {
            success: true,
            message: "Category updated successfully"
        }
    }


    async deleteCategory(id: number) {
        const existCategory = await this.prisma.categories.findFirst({
            where: {
                id,
                status: Status.active
            }
        })
        if (!existCategory) throw new NotFoundException("Category not found")

        await this.prisma.categories.update({
            where: { id }, data: { status: Status.inactive }
        })
        return {
            success: true,
            message: "Category deleted"
        }
    }
}
