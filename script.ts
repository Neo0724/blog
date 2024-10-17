import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const liked: Prisma.LikedCommentCreateInput = {
    User: {
      connect: {
        user_id: "30734b45-e49c-4c6f-97fe-0e5e56097471"
      }
    },

    Comment: {
      connect: {
        comment_id: "707e91c1-f8e8-4fe5-8d50-b0a6a07468bf"
      }
    }
  }

  await prisma.likedComment.create({data: liked})

  
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
