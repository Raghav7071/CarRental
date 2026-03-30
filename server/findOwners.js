import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const owners = await prisma.user.findMany({
        where: { role: 'owner' },
        select: { id: true, email: true }
    });
    console.log('Owners:', JSON.stringify(owners, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
