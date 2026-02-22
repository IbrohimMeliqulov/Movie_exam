import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Decimal } from "@prisma/client/runtime/client"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

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
    rating: Decimal



    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    created_by: number
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



    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    created_by?: number
}