import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    username: string


    @ApiProperty()
    @IsString()
    email: string


    // @ApiProperty({ type: "string", format: "binary", required: false })
    // @IsOptional()
    // avatar?: any


    @ApiProperty()
    @IsStrongPassword()
    password: string
}




export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    username: string


    @ApiProperty()
    @IsString()
    email: string


    // @ApiProperty({ type: "string", format: "binary", required: false })
    // @IsOptional()
    // avatar_url?: any


    @ApiProperty()
    @IsStrongPassword()
    password: string
}