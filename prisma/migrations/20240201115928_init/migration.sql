-- CreateTable
CREATE TABLE "good_count" (
    "ip" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "last_date" TIMESTAMP(3) NOT NULL,
    "today_count" INTEGER NOT NULL,
    "cumulative_count" INTEGER NOT NULL,

    CONSTRAINT "good_count_pkey" PRIMARY KEY ("ip")
);
