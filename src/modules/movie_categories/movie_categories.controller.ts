import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MovieCategoriesService } from './movie_categories.service';


@ApiBearerAuth()
@Controller('movie-categories')
export class MovieCategoriesController {
    constructor(private readonly movieCategories: MovieCategoriesService) { }

}
