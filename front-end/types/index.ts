export type User = {
    id?: number;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password: string;
    role?: string | undefined;
    payments?: Payment[];
};

export type Payment = {
    id?: number;
    amount: number;
    date: Date;
    description?: string;
    user: User;
    category: Category;
};

export type Category = {
    id?: number;
    name: string;
};
