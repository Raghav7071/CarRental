import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const cars = await prisma.car.findMany({
        take: 5
    });
    console.log('Sample Cars:', JSON.stringify(cars, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
