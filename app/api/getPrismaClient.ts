import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClient: PrismaClient;
}

if (!global.prismaClient) {
  global.prismaClient = new PrismaClient();
}

export default global.prismaClient;
