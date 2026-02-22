/*
  Warnings:

  - Changed the type of `payment_details` on the `Payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `features` on the `Subscription_plans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "payment_details",
ADD COLUMN     "payment_details" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Subscription_plans" DROP COLUMN "features",
ADD COLUMN     "features" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "avatar_url" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
