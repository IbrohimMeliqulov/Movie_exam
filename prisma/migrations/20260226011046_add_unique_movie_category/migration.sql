/*
  Warnings:

  - A unique constraint covering the columns `[slug,status]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movie_id,category_id]` on the table `Movie_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Categories_slug_status_key" ON "Categories"("slug", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_categories_movie_id_category_id_key" ON "Movie_categories"("movie_id", "category_id");
