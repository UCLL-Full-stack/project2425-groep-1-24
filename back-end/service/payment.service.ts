import paymentDB from '../repository/payment.db';
import { Payment } from '../model/payment';
import userService from './user.service';
import categoryService from './category.service';
import { CategoryInput, PaymentInput, UserInput } from '../types';
import categoryDb from '../repository/category.db';
import userDb from '../repository/user.db';

const getAllPayments = async (): Promise<Payment[]> => {
    return await paymentDB.getAllPayments();
};

const validatePayment = (amount: number, user: UserInput, category: CategoryInput): boolean => {
    if (amount <= 0) {
        throw new Error('The amount must be greater than 0');
    }

    if (!user) {
        throw new Error('The user is required');
    }
    const userPrisma = userDb.getUserByUsername(user.username);
    if (!userPrisma) {
        throw new Error('The user does not exist');
    }

    if (!category) {
        throw new Error('The category is required');
    }

    return true;
};

const createPayment = async ({
    amount,
    date,
    description,
    user,
    category,
}: PaymentInput): Promise<Payment> => {
    if (!validatePayment(amount, user, category)) {
        throw new Error('Invalid payment');
    }
    const categoryCheck = await categoryDb.getCategoryByName(category.name);
    if (!categoryCheck) {
        await categoryService.createCategory(category.name);
    }

    const userPrisma = await userService.getUserByUsername(user.username);
    const categoryPrisma = await categoryService.getCategoryByName(category.name);
    const newPayment = new Payment({
        amount,
        date,
        description,
        user: userPrisma,
        category: categoryPrisma,
    });
    return await paymentDB.createPayment(
        newPayment.getAmount(),
        newPayment.getDate() || new Date(),
        newPayment.getUser(),
        newPayment.getCategory(),
        newPayment.getDescription()
    );
};

export default {
    getAllPayments,
    createPayment,
};
