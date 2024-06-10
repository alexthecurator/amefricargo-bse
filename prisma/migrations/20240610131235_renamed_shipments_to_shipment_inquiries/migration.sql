/*
  Warnings:

  - You are about to drop the `Shipments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cargo" DROP CONSTRAINT "Cargo_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Shipments" DROP CONSTRAINT "Shipments_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_shipmentsId_fkey";

-- DropTable
DROP TABLE "Shipments";

-- CreateTable
CREATE TABLE "ShipmentInquiries" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT DEFAULT 'New Inquiry',
    "description" TEXT,
    "quote" DOUBLE PRECISION DEFAULT 0.0,
    "credit" DOUBLE PRECISION DEFAULT 0.0,
    "debit" DOUBLE PRECISION DEFAULT 0.0,
    "status" TEXT DEFAULT 'inquired',
    "from" TIMESTAMP(3),
    "to" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShipmentInquiries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShipmentInquiries" ADD CONSTRAINT "ShipmentInquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD CONSTRAINT "Cargo_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "ShipmentInquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_shipmentsId_fkey" FOREIGN KEY ("shipmentsId") REFERENCES "ShipmentInquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
