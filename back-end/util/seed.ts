import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();

    const UserBram = await prisma.user.create({
        data: {
            username: 'bramcelis',
            firstName: 'Bram',
            lastName: 'Celis',
            email: 'bram.celis21@gmail.com',
            password: 'bramcelis',
        },
    });

    const UserJef = await prisma.user.create({
        data: {
            username: 'jefvermeiren',
            firstName: 'Jef',
            lastName: 'Vermeiren',
            email: 'jef.vermeire@gmail.com',
            password: 'jefvermeiren',
        },
    });

    const payment1 = await prisma.payment.create({
        data: {
            amount: 100,
            date: set(new Date(), { hours: 12, minutes: 0 }),
            user: {
                connect: {
                    id: UserBram.id,
                },
            },
            description: 'Lunch',
        },
    });

    const payment2 = await prisma.payment.create({
        data: {
            amount: 50,
            date: set(new Date(), { hours: 18, minutes: 0 }),
            user: {
                connect: {
                    id: UserJef.id,
                },
            },
            description: 'Dinner',
        },
    });

    const payment3 = await prisma.payment.create({
        data: {
            amount: 200,
            date: set(new Date(), { hours: 12, minutes: 0 }),
            user: {
                connect: {
                    id: UserBram.id,
                },
            },
            description: 'Dinner',
        },
    });
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
