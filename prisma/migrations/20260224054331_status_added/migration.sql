/*
  Warnings:

  - The values [Active,Expired,Canceled,Pending_payment] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `User_subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Active', 'Expired', 'Canceled', 'Pending_payment');

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('active', 'inactive');
ALTER TABLE "public"."User_subscriptions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Movie_files" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "Favorites" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
COMMIT;

-- AlterTable
ALTER TABLE "Favorites" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Movie_files" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User_subscriptions" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'Pending_payment';
