import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class SubscriptionPlansDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(10)
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
    name?: string

    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' || value === null ? undefined : value)
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(10)
    @Type(() => Number)
    price?: number

    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' || value === null ? undefined : value)
    @IsOptional()
    @IsNumber()
    duration_days?: number

    @ApiPropertyOptional()
    @Transform(({ value }) => !value || value.length === 0 ? undefined : value)
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    features?: string[]
}