import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"

export class MoviesCategoriesDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    movie_id: number


    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    category_id: number
}



export class UpdateMoviesCategoriesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    movie_id: number


    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    category_id: number
}