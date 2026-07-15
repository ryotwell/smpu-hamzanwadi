// prisma database seeder

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {

    const password = await bcrypt.hash('12345678', 10);

    await prisma
        .user
        .create({
            data: {
                name: "Zulzario Zaeri",
                email: "ryotwell@icloud.com",
                password: password,
            },
        })

    console.log("Super Admin created successfully");
}

main()
    .then(() => {
        console.log("Seeding completed");
        prisma.$disconnect();
    })
    .catch((error) => {
        console.error(error);
        prisma.$disconnect();
    });