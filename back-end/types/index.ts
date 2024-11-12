import { Payment } from '../model/payment';

type Role = 'admin' | 'user';

type UserInput = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    payments: PaymentInput[];
};

type PaymentInput = {
    id?: number;
    amount: number;
    date: Date;
    description?: string;
    user: UserInput;
    category: CategoryInput;
};

type CategoryInput = {
    id?: number;
    name: string;
    description: string;
};

export { Role, UserInput, PaymentInput, CategoryInput };
