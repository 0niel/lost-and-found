-- AlterTable
ALTER TABLE "LostAndFoundItem" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 week';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;
