// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';
import { sub } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.payment.deleteMany();
    await prisma.user.deleteMany();

    await prisma.category.deleteMany();
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
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: 'Electronics',
        },
    });

    const category3 = await prisma.category.create({
        data: {
            name: 'Transport',
        },
    });

    const category4 = await prisma.category.create({
        data: {
            name: 'Rent',
        },
    });
    const payment1 = await prisma.payment.create({
        data: {
            amount: 43,
            date: set(new Date(), { hours: 12, minutes: 0 }),
            user: {
                connect: {
                    id: UserJef.id,
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
            amount: 134,
            date: set(new Date(), { hours: 12, minutes: 0 }),
            user: {
                connect: {
                    id: UserJef.id,
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

    const payment4 = await prisma.payment.create({
        data: {
            amount: 98,
            date: sub(new Date(), { weeks: 1 }),
            user: {
                connect: {
                    id: UserJef.id,
                },
            },
            description: 'Train ticket',
            category: {
                connect: {
                    id: category3.id,
                },
            },
        },
    });

    const payment5 = await prisma.payment.create({
        data: {
            amount: 300,
            date: sub(new Date(), { months: 1 }),
            user: {
                connect: {
                    id: UserJef.id,
                },
            },
            description: 'Monthly rent',
            category: {
                connect: {
                    id: category4.id,
                },
            },
        },
    });

    const payment6 = await prisma.payment.create({
        data: {
            amount: 234,
            date: sub(new Date(), { years: 1 }),
            user: {
                connect: {
                    id: UserJef.id,
                },
            },
            description: 'Food',
            category: {
                connect: {
                    id: category1.id,
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
