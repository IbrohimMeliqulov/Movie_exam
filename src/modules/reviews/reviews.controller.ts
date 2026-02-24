import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';

@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reaviewService: ReviewsService) { }



}
