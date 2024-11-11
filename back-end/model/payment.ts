import { User } from './user';
import { User as UserPrisma, Payment as PaymentPrisma } from '@prisma/client';

export class Payment {
    private id?: number;
    private amount: number;
    private date: Date;
    private description?: string;
    private user: User;

    constructor(payment: {
        id?: number;
        amount: number;
        date: Date;
        description?: string;
        user: User;
    }) {
        this.validate(payment);

        this.id = payment.id;
        this.amount = payment.amount;
        this.date = payment.date;
        this.description = payment.description;
        this.user = payment.user;
    }

    static from({
        id,
        amount,
        date,
        description,
        user,
    }: PaymentPrisma & { user: UserPrisma }): Payment {
        return new Payment({
            id,
            amount,
            date,
            description,
            user: User.from(user),
        });
    }

    getId(): number | undefined {
        return this.id;
    }

    getAmount(): number {
        return this.amount;
    }

    getDate(): Date {
        return this.date;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getUser(): User {
        return this.user;
    }

    validate(payment: { amount: number; date: Date; description?: string; user: User }) {
        if (!payment.amount) {
            throw new Error('Amount is required');
        }

        if (!payment.date) {
            throw new Error('Date is required');
        }

        if (!payment.user) {
            throw new Error('User is required');
        }
    }
}
