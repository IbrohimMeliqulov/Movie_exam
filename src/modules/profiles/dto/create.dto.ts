import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsOptional, IsPhoneNumber, IsString } from "class-validator"

export class CreateProfileDto {

    @ApiProperty()
    @IsString()
    full_name: string


    @ApiProperty()
    @IsPhoneNumber("UZ")
    phone: string

    @ApiProperty()
    @IsString()
    country: string
}



export class UpdateProfileDto {

    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    full_name?: string


    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsPhoneNumber("UZ")
    phone?: string

    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    country?: string
}
