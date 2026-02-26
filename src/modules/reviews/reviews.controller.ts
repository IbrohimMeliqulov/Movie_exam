import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ReviewsDto, UpdateReviewsDto } from './dto/create.dto';

@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewService: ReviewsService) { }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin, Role.User)
    @Get()
    getAllReviewz(
        @Req() req: Request
    ) {
        return this.reviewService.getAllReviews(req['user'])
    }


    @ApiOperation({
        summary: `${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get("single:id")
    getOwnReviews(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.reviewService.getOneReview(id)
    }


    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User)
    @Post()
    createReview(
        @Body() payload: ReviewsDto,
        @Req() req: Request
    ) {
        return this.reviewService.createReview(payload, req['user'])
    }



    @ApiOperation({
        summary: `${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User)
    @Put(":id")
    updateReview(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateReviewsDto,
        @Req() req: Request) {
        return this.reviewService.updateReview(id, payload, req['user'])
    }




    @ApiOperation({
        summary: `,${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.User)
    @Delete(":id")
    deleteReview(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.reviewService.deleteReview(id, req['user'])
    }
}
