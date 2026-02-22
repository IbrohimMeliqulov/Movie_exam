import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CategoriesDto, UpdateCategoriesDto } from './dto/create.dto';


@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get()
    getAllCategories() {
        return this.categoriesService.getAllCategories()
    }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get(":id")
    getOneCategory(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.categoriesService.getOneCategory(id)
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Post()
    createCategory(
        @Body() payload: CategoriesDto
    ) {
        return this.categoriesService.createCategory(payload)
    }



    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Put(":id")
    updateCategory(
        @Body() payload: UpdateCategoriesDto,
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.categoriesService.updateCategory(id, payload)
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Delete(":id")
    deleteCategory(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.categoriesService.deleteCategory(id)
    }
}
