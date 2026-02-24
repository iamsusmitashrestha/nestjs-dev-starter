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
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: {
        name: category.name,
        slug: category.slug,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
