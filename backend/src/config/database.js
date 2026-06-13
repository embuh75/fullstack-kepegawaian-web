const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
});
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
module.exports = prisma;
