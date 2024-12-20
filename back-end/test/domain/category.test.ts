import { Category } from '../../model/category';
import { Category as CategoryPrisma } from '@prisma/client';

// Mock CategoryPrisma object
const categoryPrismaMock: CategoryPrisma = { id: 1, name: 'Electronics' };

test('should create a Category instance with valid properties', () => {
    const category = new Category({ id: 1, name: 'Electronics' });

    expect(category.getId()).toBe(1);
    expect(category.getName()).toBe('Electronics');
});

test('should throw error if name is not provided in constructor', () => {
    expect(() => {
        new Category({ id: 1, name: '' });
    }).toThrowError('Category name is required');
});

test('should create a Category instance using from() method', () => {
    const category = Category.from(categoryPrismaMock);

    expect(category.getId()).toBe(1);
    expect(category.getName()).toBe('Electronics');
});

test('should throw error if name is not provided when calling from()', () => {
    const invalidCategoryPrismaMock = { id: 1, name: '' };

    expect(() => {
        Category.from(invalidCategoryPrismaMock);
    }).toThrowError('Category name is required');
});
