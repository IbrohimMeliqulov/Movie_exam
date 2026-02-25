import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMoviesQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(['free', 'premium'])
    subscription_type?: 'free' | 'premium';
}