import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma";
import { Role, Status } from "../generated/prisma/enums";

async function main() {
  console.log(`🚀 Start seeding users...`);

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash("12345678", salt);

  // Create 3 specific users for testing
  const testUsers = [
    // 1. Admin user
    {
      phone: "09123456789",
      password: defaultPassword,
      randToken: faker.internet.jwt(),
      firstName: "Admin",
      lastName: "User",
      email: "admin@snackstore.com",
      address: "123 Admin Street",
      city: "Yangon",
      region: "Yangon Region",
      role: Role.ADMIN,
      status: Status.ACTIVE,
      lastLogin: new Date(),
      errorLoginCount: 0,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
    // 2. Active regular user
    {
      phone: "09987654321",
      password: defaultPassword,
      randToken: faker.internet.jwt(),
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      address: "456 Main Street",
      city: "Mandalay",
      region: "Mandalay Region",
      role: Role.USER,
      status: Status.ACTIVE,
      lastLogin: new Date(),
      errorLoginCount: 0,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    // 3. Inactive user
    {
      phone: "09777777777",
      password: defaultPassword,
      randToken: faker.internet.jwt(),
      firstName: "Inactive",
      lastName: "User",
      email: "inactive@example.com",
      address: "789 Inactive Lane",
      city: "Naypyidaw",
      region: "Naypyidaw Union Territory",
      role: Role.USER,
      status: Status.INACTIVE,
      lastLogin: faker.date.past({ years: 1 }),
      errorLoginCount: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Inactive",
    },
  ];

  let createdCount = 0;
  let skippedCount = 0;

  console.log(`Creating ${testUsers.length} test users...\n`);

  for (const user of testUsers) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { phone: user.phone },
      });

      if (existingUser) {
        console.log(`Skipping user ${user.phone} - already exists`);
        skippedCount++;
        continue;
      }

      // Create user
      const createdUser = await prisma.user.create({
        data: user,
      });

      createdCount++;
      console.log(`✅Created user ${createdCount}:`);
    } catch (error) {
      console.error(`❌Error creating user ${user.phone}:`, error);
    }
  }

  console.log(`🎉 Seeding finished!\n`);
  console.log(`Statistics:`);
  console.log(`Created: ${createdCount} users`);
  console.log(`Total in database: ${await prisma.user.count()} users`);

  console.log(`Login Credentials:`);
  console.log(`Admin - Phone: 09123456789 | Password: 12345678`);
  console.log(`User  - Phone: 09987654321 | Password: 12345678`);
  console.log(`Inactive User - Phone: 09777777777 | Password: 12345678`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
