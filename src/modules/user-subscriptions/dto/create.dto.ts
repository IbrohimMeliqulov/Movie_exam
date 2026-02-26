import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class UserSubscriptionsDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    plan_id: number
}



export class UpdateUserSubscriptionDto {
    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    auto_renew?: boolean;
}