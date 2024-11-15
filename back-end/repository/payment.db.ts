import database from './database';
import { Payment } from '../model/payment';
import { Category } from '../model/category';
import { User } from '../model/user';

const getAllPayments = async (): Promise<Payment[]> => {
    try {
        const paymentsprisma = await database.payment.findMany({
            include: {
                user: true,
                category: true,
            },
        });
        return paymentsprisma.map((paymentPrisma) => Payment.from(paymentPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting all payments');
    }
};

const createPayment = async (
    amount: number,
    date: Date,
    user: User,
    category: Category,
    description?: string
): Promise<Payment> => {
    try {
        const paymentPrisma = await database.payment.create({
            data: {
                amount: amount,
                date: date,
                description: description ?? '',
                user: {
                    connect: { id: user.getId() }, // Assumes user has an `id` property
                },
                category: {
                    connect: { id: category.getId() }, // Assumes category has an `id` property
                },
            },
            include: {
                user: true,
                category: true,
            },
        });
        return Payment.from(paymentPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while creating a payment');
    }
};

export default {
    getAllPayments,
    createPayment,
};
