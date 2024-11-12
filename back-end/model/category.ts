import { Category as CategoryPrisma } from '@prisma/client';

export class Category {
    private id?: number;
    private name: string;
    private description: string;

    constructor(category: { id?: number; name: string; description: string }) {
        this.validate(category);

        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
    }

    static from({ id, name, description }: CategoryPrisma): Category {
        return new Category({ id, name, description });
    }

    validate(category: { id?: number; name: string; description: string }) {
        if (!category.name) {
            throw new Error('Category name is required');
        }
        if (!category.description) {
            throw new Error('Category description is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }
}
