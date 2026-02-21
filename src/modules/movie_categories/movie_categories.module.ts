import { Module } from '@nestjs/common';
import { MovieCategoriesController } from './movie_categories.controller';
import { MovieCategoriesService } from './movie_categories.service';

@Module({
  controllers: [MovieCategoriesController],
  providers: [MovieCategoriesService]
})
export class MovieCategoriesModule {}
