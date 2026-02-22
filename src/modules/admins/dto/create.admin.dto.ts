import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsOptional, IsString, IsStrongPassword } from "class-validator"

export class CreateAdminDto {
    @ApiProperty()
    @IsString()
    username: string


    @ApiProperty()
    @IsString()
    email: string



    @ApiProperty()
    @IsStrongPassword()
    password: string
}




export class UpdateAdminDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    username?: string


    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    email?: string



    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsStrongPassword()
    password?: string
}