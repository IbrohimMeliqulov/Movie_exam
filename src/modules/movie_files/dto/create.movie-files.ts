import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class MovieFilesDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  movie_id: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string
}


export class UpdateMovieFilesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  movie_id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string
}