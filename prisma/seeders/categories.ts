import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Restaurant & Food',
    slug: 'restaurant-and-food',
  },
  {
    name: 'Health & Wellness',
    slug: 'health-and-wellness',
  },
  {
    name: 'Retail & Shopping',
    slug: 'retail-and-shopping',
  },
  {
    name: 'Professional Services',
    slug: 'professional-services',
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-and-personal-care',
  },
];

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding business categories...');

  for (const category of categories) {
    const upserted = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: {
        name: category.name,
        slug: category.slug,
      },
    });

    // eslint-disable-next-line no-console
    console.log(`✅ Category seeded: ${upserted.name} (${upserted.slug})`);
  }

  // eslint-disable-next-line no-console
  console.log(`\n🎉 Seeding complete. ${categories.length} categories seeded.`);
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
