/*
  Warnings:

  - You are about to drop the `CarrierProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarrierProfile" DROP CONSTRAINT "CarrierProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_carrierId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_requestId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_customerId_fkey";

-- DropTable
DROP TABLE "CarrierProfile";

-- DropTable
DROP TABLE "Offer";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "UserRole";
