import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UserSubscriptionsDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    user_id: number

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    plan_id: number
}



export class UpdateUserSubscriptionsDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    user_id?: number

    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    plan_id?: number

}