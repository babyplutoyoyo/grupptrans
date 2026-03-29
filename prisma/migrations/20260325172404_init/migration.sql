-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'CARRIER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyType" TEXT,
    "companyName" TEXT,
    "busModel" TEXT,
    "seats" INTEGER,
    "hasAc" BOOLEAN NOT NULL DEFAULT false,
    "hasBelts" BOOLEAN NOT NULL DEFAULT false,
    "hasLuggage" BOOLEAN NOT NULL DEFAULT false,
    "busYear" INTEGER,
    "paymentTypes" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarrierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fromCity" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "routePoints" JSONB,
    "returnToOrigin" BOOLEAN NOT NULL DEFAULT true,
    "passengers" INTEGER NOT NULL,
    "hasChildren" BOOLEAN NOT NULL DEFAULT false,
    "tripDate" TIMESTAMP(3) NOT NULL,
    "busType" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "comment" TEXT,
    "distanceKm" DOUBLE PRECISION,
    "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierProfile_userId_key" ON "CarrierProfile"("userId");

-- AddForeignKey
ALTER TABLE "CarrierProfile" ADD CONSTRAINT "CarrierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
