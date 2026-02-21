import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class SubscriptionPlansDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Type(() => Number)
    price: number


    @ApiProperty()
    @IsNumber()
    duration_days: number


    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    features: string[]
}



export class UpdateSubscriptionPlansDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    name: string

    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    price: number


    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsNumber()
    duration_days: number


    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    features: string[]
}
