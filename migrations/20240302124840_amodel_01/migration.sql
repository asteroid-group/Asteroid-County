-- CreateTable
CREATE TABLE "Asteroid" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "closeApproachDate" TIMESTAMP(3) NOT NULL,
    "diameterMin" DOUBLE PRECISION NOT NULL,
    "diameterMax" DOUBLE PRECISION NOT NULL,
    "potentiallyHazardous" BOOLEAN NOT NULL,
    "velocity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Asteroid_pkey" PRIMARY KEY ("id")
);
