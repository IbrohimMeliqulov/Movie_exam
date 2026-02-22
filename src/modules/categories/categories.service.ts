import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CategoriesDto, UpdateCategoriesDto } from './dto/create.dto';
import { slugify } from 'src/core/utils/slugify';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async getAllCategories() {
        const categories = await this.prisma.categories.findMany()

        return {
            success: true,
            data: categories
        }
    }

    async getOneCategory(id: number) {
        const existCategory = await this.prisma.categories.findUnique({
            where: { id }
        })
    }

    async createCategory(payload: CategoriesDto) {
        const categorySlug = slugify(payload.slug)
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
        const existCategory = await this.prisma.categories.findUnique({
            where: { id }
        })
        if (!existCategory) throw new NotFoundException("Category not found")

        await this.prisma.categories.update({
            where: { id },
            data: {
                ...payload,
                slug: payload.slug ? slugify(payload.slug) : existCategory.slug
            }
        })

        return {
            success: true,
            message: "Category updated successfully"
        }
    }


    async deleteCategory(id: number) {
        const existCategory = await this.prisma.categories.findUnique({
            where: { id }
        })
        if (!existCategory) throw new NotFoundException("Category not found")

        await this.prisma.categories.delete({
            where: { id }
        })
        return {
            success: true,
            message: "Category deleted"
        }
    }
}
