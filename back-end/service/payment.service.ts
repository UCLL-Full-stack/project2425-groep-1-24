import paymentDB from '../repository/payment.db';
import { Payment } from '../model/payment';

const getAllPayments = async (): Promise<Payment[]> => {
    return await paymentDB.getAllPayments();
};

export default {
    getAllPayments,
};
