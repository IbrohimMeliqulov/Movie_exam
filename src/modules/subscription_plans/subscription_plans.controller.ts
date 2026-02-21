import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription_plans.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { SubscriptionPlansDto } from './dto/create.dto';


@ApiBearerAuth()
@Controller('subscription-plans')
export class SubscriptionPlansController {
    constructor(private readonly subscriptionService: SubscriptionPlansService) { }

    @ApiOperation({
        summary: `${Role.User},${Role.Superadmin},${Role.Admin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.User, Role.Admin, Role.Superadmin)
    @Get()
    getAllSubscriptions() {
        return this.subscriptionService.getAllSubscriptions()
    }


    @ApiOperation({
        summary: `${Role.Superadmin}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.Superadmin)
    @Post()
    createSubscription(
        @Body() payload: SubscriptionPlansDto
    ) {
        return this.subscriptionService.createSubscription(payload)
    }


}
