import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"

export class FavoritesDto {

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    movie_id: number
}

export class UpdateFavoritesDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    movie_id?: number
}