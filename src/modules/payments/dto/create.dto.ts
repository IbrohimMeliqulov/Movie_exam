import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Payment_method, Payment_status } from "@prisma/client"
import { Transform, Type } from "class-transformer"
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class PaymentDto {
    @ApiProperty()
    @IsNumber()
    user_subscription_id: number

    @ApiProperty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(10)
    @Type(() => Number)
    amount: number

    @ApiProperty({ enum: Payment_method, enumName: "Payment_method" })
    @IsEnum(Payment_method)
    payment_method: Payment_method


    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    payment_details: string[]
}



export class UpdatePaymentDto {
    @ApiPropertyOptional({ enum: Payment_status, enumName: "Payment_status" })
    @IsOptional()
    @IsEnum(Payment_status)
    payment_status?: Payment_status
}