import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Payment_method } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/client"
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
    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsNumber()
    user_subscription_id?: number

    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    amount?: number

    @ApiPropertyOptional({ enum: Payment_method, enumName: "Payment_method" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsEnum(Payment_method)
    payment_method?: Payment_method


    @ApiPropertyOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsArray({ each: true })
    @IsString()
    payment_details?: string[]
}