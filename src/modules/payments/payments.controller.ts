import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { PaymentDto, UpdatePaymentDto } from './dto/create.dto';

@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @ApiOperation({
        summary: `$${Role.Superadmin},${Role.Admin},${Role.User}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin, Role.User)
    @Get()
    getAllPayments(
        @Req() req: Request
    ) {
        return this.paymentsService.getAllPayments(req['user'])
    }


    @ApiOperation({
        summary: `$${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Admin, Role.Superadmin)
    @Get("inactive")
    getInactivePayments() {
        return this.paymentsService.getInactivePayments()
    }




    @ApiOperation({
        summary: `${Role.User},${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin, Role.Superadmin)
    @Get(":id")
    getOnePayment(@Param("id", ParseIntPipe) id: number) {
        return this.paymentsService.getSinglePayment(id)
    }

    @ApiOperation({
        summary: `${Role.User},${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin, Role.Superadmin)
    @Post()
    createPayment(
        @Body() payload: PaymentDto,
        @Req() req: Request
    ) {
        return this.paymentsService.createPayment(payload, req["user"])
    }


    @ApiOperation({
        summary: `${Role.User},${Role.Admin},${Role.Superadmin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin, Role.Superadmin)
    @Put(":id")
    updatePayment(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdatePaymentDto,
        @Req() req: Request
    ) {
        return this.paymentsService.updatePayment(id, payload, req["user"])
    }


    @ApiOperation({
        summary: `${Role.User},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin)
    @Delete(":id")
    deletePayment(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.paymentsService.deletePayment(id, req["user"])
    }
}
