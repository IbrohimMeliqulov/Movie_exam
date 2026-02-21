import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class LoginDto {
    @ApiProperty({ example: "ibrohim15" })
    @IsString()
    username: string


    @ApiProperty({ example: "Ibrohim2823!" })
    @IsString()
    password: string
}