-- Add price category columns to Service
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "priceCar" INTEGER;
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "priceTruck" INTEGER;
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "priceTrailer" INTEGER;

-- Add carCategory to Booking
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "carCategory" TEXT;
