import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  
   const userId =  "4e128380-6160-4820-9d5c-acb242e5d86b";
// 3. Contas
const accounts = [
  { name: "Nubank", type: "CORRENTE" },
  { name: "Itaú", type: "POUPANCA" },
];

for (const account of accounts) {
  await prisma.account.upsert({
    where: {
      userId_name: {
        userId: userId,
        name: account.name,
      },
    },
    update: {},
    create: {
      userId,
      name: account.name,
      type: account.type as any,
    },
  });
}

console.log("Contas criadas.");
}

main()
  .then(() => {
    console.log("Seed finalizado.");
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error("Erro no seed:", err);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
