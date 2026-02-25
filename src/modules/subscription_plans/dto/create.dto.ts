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
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString()
    name?: string

    @ApiPropertyOptional({ example: null })
    @IsOptional()
    @Transform(({ value }) => value === '' || value === null ? undefined : value)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(10)
    @Type(() => Number)
    price?: number

    @ApiPropertyOptional({ example: null })
    @IsOptional()
    @Transform(({ value }) => value === '' || value === null ? undefined : value)
    @IsNumber()
    duration_days?: number

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => !value || value.length === 0 ? undefined : value)
    @IsArray()
    @IsString({ each: true })
    features?: string[]
}