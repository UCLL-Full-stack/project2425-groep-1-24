// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';
import { connect } from 'http2';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();
    const hashedPassword1 = await bcrypt.hash('bramcelis', 12);
    const hashedPassword2 = await bcrypt.hash('jefvermeiren', 12);

    const UserBram = await prisma.user.create({
        data: {
            username: 'bramcelis',
            firstName: 'Bram',
            lastName: 'Celis',
            email: 'bram.celis21@gmail.com',
            password: hashedPassword1,
            role: 'admin',
        },
    });

    const UserJef = await prisma.user.create({
        data: {
            username: 'jefvermeiren',
            firstName: 'Jef',
            lastName: 'Vermeiren',
            email: 'jef.vermeire@gmail.com',
            password: hashedPassword2,
            role: 'user',
        },
    });

    const category1 = await prisma.category.create({
        data: {
            name: 'Food',
            description: 'All food expenses',
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: 'Electronics',
            description: 'All electronic expenses',
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
            category: {
                connect: {
                    id: category1.id,
                },
            },
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
            category: {
                connect: {
                    id: category1.id,
                },
            },
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
            description: 'New gaming mouse',
            category: {
                connect: {
                    id: category2.id,
                },
            },
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
