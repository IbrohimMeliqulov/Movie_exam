import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
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
    @IsOptional()
    @IsString()
    username: string


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email: string



    @ApiPropertyOptional()
    @IsOptional()
    @IsStrongPassword()
    password: string
}