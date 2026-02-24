import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsNumber, IsString, Max, Min } from "class-validator"

export class ReviewsDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    user_id: number

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    movie_id: number

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number


    @ApiProperty()
    @IsString()
    comment: string
}