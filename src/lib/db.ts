

// import { PrismaClient } from "@prisma/client"
 
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
// export const prisma = globalForPrisma.prisma || new PrismaClient()
 
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma






// import { PrismaClient } from "@prisma/client"
 
// declare global {
//   const prisma: PrismaClient | undefined
// }
// export const db = globalThis.prisma || new PrismaClient()
 
// if (process.env.NODE_ENV !== "production") globalThis.prisma = db




import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
