import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class CategoriesDto {
    @ApiProperty()
    @IsString()
    name: string


    @ApiProperty()
    @IsString()
    slug: string


    @ApiProperty()
    @IsString()
    description: string
}



export class UpdateCategoriesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slug?: string


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string
}