import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@tirnew.ua" },
    update: {},
    create: {
      email: "admin@tirnew.ua",
      password: hash,
      role: "admin",
    },
  });
  console.log("✅ Admin user created: admin@tirnew.ua / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
