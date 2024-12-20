import { Category as CategoryPrisma } from '@prisma/client';

export class Category {
    private id?: number;
    private name: string;

    constructor(category: { id?: number; name: string }) {
        this.validate(category);

        this.id = category.id;
        this.name = category.name;
    }

    static from({ id, name }: CategoryPrisma): Category {
        return new Category({ id, name });
    }

    validate(category: { id?: number; name: string }) {
        if (!category.name) {
            throw new Error('Category name is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }
}
