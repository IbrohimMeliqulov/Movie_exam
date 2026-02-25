import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsOptional, IsString } from "class-validator"

export class CategoriesDto {
    @ApiProperty()
    @IsString()
    name: string


    @ApiProperty()
    @IsString()
    description: string
}



export class UpdateCategoriesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString()
    name?: string



    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString()
    description?: string
}