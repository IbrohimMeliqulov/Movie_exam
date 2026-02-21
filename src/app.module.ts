import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SubscriptionPlansModule } from './modules/subscription_plans/subscription_plans.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MoviesModule } from './modules/movies/movies.module';
import { MovieCategoriesModule } from './modules/movie_categories/movie_categories.module';
import { MovieFilesModule } from './modules/movie_files/movie_files.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WatchHistoryModule } from './modules/watch_history/watch_history.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "src", 'uploads'),
      serveRoot: "/files"
    }), ConfigModule.forRoot({
      isGlobal: true
    }), JwtModule.register({
      global: true,
      signOptions: { expiresIn: "12h" },
      secret: "shaftoli"
    }), UsersModule, ProfilesModule, SubscriptionPlansModule, PaymentsModule, CategoriesModule, MoviesModule, MovieCategoriesModule, MovieFilesModule, FavoritesModule, ReviewsModule, WatchHistoryModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
