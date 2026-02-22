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


    @ApiProperty()
    @IsString()
    start_date: string


    @ApiProperty()
    @IsString()
    end_date: string
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


    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    start_date?: string


    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    end_date?: string
}