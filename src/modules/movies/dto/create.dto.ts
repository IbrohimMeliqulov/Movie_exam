import { ApiProperty } from "@nestjs/swagger"
import { Decimal } from "@prisma/client/runtime/client"
import { Type } from "class-transformer"
import { IsNumber, IsString, Max, Min } from "class-validator"

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