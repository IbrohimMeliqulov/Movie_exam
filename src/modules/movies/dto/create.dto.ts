import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Subscription_type } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/client"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class MoviesDto {
    @ApiProperty()
    @IsString()
    title: string

    @ApiProperty()
    @IsString()
    description: string

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    release_year: number

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    duration_minutes: number

    @ApiProperty()
    @IsNumber({ maxDecimalPlaces: 1 })
    @Min(0)
    @Max(10)
    @Type(() => Number)
    rating: number

    @ApiProperty({ enum: Subscription_type, enumName: "Subscription_type", default: Subscription_type.free })
    @IsEnum(Subscription_type)
    @IsOptional()
    subscription_type?: Subscription_type
}



export class UpdateMoviesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string


    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    release_year?: number


    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    duration_minutes?: number


    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 1 })
    @Min(0)
    @Max(10)
    @Type(() => Number)
    rating?: Decimal



    @ApiPropertyOptional({ enum: Subscription_type, enumName: "Subscription_type", default: Subscription_type.free })
    @IsEnum(Subscription_type)
    @IsOptional()
    subscription_type?: Subscription_type

}