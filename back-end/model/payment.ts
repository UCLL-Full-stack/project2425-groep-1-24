import { Category } from './category';
import { User } from './user';
import {
    User as UserPrisma,
    Payment as PaymentPrisma,
    Category as CategoryPrisma,
} from '@prisma/client';

export class Payment {
    private id?: number;
    private amount: number;
    private date?: Date;
    private description?: string;
    private user: User;
    private category: Category;

    constructor(payment: {
        id?: number;
        amount: number;
        date?: Date;
        description?: string;
        user: User;
        category: Category;
    }) {
        this.validate(payment);

        this.id = payment.id;
        this.amount = payment.amount;
        this.date = payment.date;
        this.description = payment.description;
        this.user = payment.user;
        this.category = payment.category;
    }

    static from({
        id,
        amount,
        date,
        description,
        user,
        category,
    }: PaymentPrisma & { user: UserPrisma; category: CategoryPrisma }): Payment {
        return new Payment({
            id,
            amount,
            date,
            description,
            user: User.from(user),
            category: Category.from(category),
        });
    }

    getId(): number | undefined {
        return this.id;
    }

    getAmount(): number {
        return this.amount;
    }

    getDate(): Date | undefined {
        return this.date;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getUser(): User {
        return this.user;
    }

    getCategory(): Category {
        return this.category;
    }

    validate(payment: { amount: number; description?: string; user: User }) {
        if (!payment.amount) {
            throw new Error('Amount is required');
        }

        if (!payment.user) {
            throw new Error('User is required');
        }
    }
}
