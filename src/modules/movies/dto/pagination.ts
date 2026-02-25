import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetMoviesQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;


    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    category?: string;


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;


    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(['free', 'premium'])
    subscription_type?: 'free' | 'premium';
}