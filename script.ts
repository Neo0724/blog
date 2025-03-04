import { PrismaClient, Prisma } from "@prisma/client";

const prisma = prismaClient as PrismaClient;

async function main() {
  console.log("Hello World");
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/* 
  User 1: Tashi, neoben007
  User 2: Alan, alantan
  
*/
