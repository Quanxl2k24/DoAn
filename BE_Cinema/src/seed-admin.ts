import prisma from "./config/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding Admin account...");

  // Tạo role ADMIN nếu chưa có
  let adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" }
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: "ADMIN" }
    });
    console.log("Created ADMIN role.");
  } else {
    console.log("ADMIN role already exists.");
  }

  // Thông tin admin
  const adminEmail = "admin@noircinema.com";
  const passwordStr = "admin123456";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log(`Admin user ${adminEmail} already exists.`);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordStr, salt);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: "Noir Administrator",
        phoneNumber: "0901234567",
        roleId: adminRole.id
      }
    });
    console.log(`Successfully created Admin account:`);
    console.log(`- Email: ${adminEmail}`);
    console.log(`- Password: ${passwordStr}`);
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
