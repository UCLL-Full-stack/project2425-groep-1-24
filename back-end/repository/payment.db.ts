import database from './database';
import { Payment } from '../model/payment';

const getAllPayments = async (): Promise<Payment[]> => {
    try {
        const paymentsprisma = await database.payment.findMany({
            include: {
                user: true,
            },
        });
        return paymentsprisma.map((paymentPrisma) => Payment.from(paymentPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting all payments');
    }
};

export default {
    getAllPayments,
};
