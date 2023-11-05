import { PrismaClient } from '@prisma/client';
import { recipes } from './recipes';

const prisma = new PrismaClient();

async  function main() {
    const recipe1 = await prisma.recipe.createMany({
        data: recipes
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })