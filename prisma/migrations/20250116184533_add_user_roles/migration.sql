/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `User_Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_Roles_user_id_role_key";

-- AlterTable
ALTER TABLE "User_Roles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Game";

-- CreateIndex
CREATE UNIQUE INDEX "User_Roles_user_id_key" ON "User_Roles"("user_id");
