import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add initial seed data here when needed.
  console.log('No seed data defined yet.');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
