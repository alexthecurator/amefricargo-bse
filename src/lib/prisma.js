import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  } else {
    prisma = global.prisma;
  }
} else {
  prisma = new PrismaClient();
}

export default prisma;
