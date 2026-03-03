import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');
    const username = 'richieshop';
    const password = 'richieshop09';

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        console.log(`User ${username} already exists. Skipping.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            password_hash: hashedPassword
        }
    });
    console.log(`Created user: ${user.username}`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
