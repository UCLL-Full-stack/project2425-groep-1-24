import { Payment } from '../../model/payment'; // Update the import to match your file location
import { User } from '../../model/user'; // Import the User class as well
import { Category } from '../../model/category'; // Import the Category class as well
import {
    User as UserPrisma,
    Payment as PaymentPrisma,
    Category as CategoryPrisma,
} from '@prisma/client';

// Mock data for User, Category, and PaymentPrisma
const userMock: UserPrisma = {
    id: 1,
    username: 'John Doe',
    firstName: 'John',
    lastName: 'DOe',
    email: 'johndoe@gmail.com',
    password: 'johndoe123',
    role: 'user',
};
const categoryMock: CategoryPrisma = { id: 1, name: 'Electronics' };
const paymentPrismaMock: PaymentPrisma = {
    id: 1,
    amount: 100,
    date: new Date(),
    description: 'Test payment',
    userId: 1,
    categoryId: 1,
};

// Create mock User and Category objects
const user = new User({
    id: 1,
    username: 'John Doe',
    firstName: 'John',
    lastName: 'DOe',
    email: 'johndoe@gmail.com',
    password: 'johndoe123',
    role: 'user',
});
const category = new Category({ id: 1, name: 'Electronics' });

test('should create a Payment instance with valid properties', () => {
    const payment = new Payment({
        id: 1,
        amount: 100,
        date: new Date(),
        description: 'Test payment',
        user,
        category,
    });

    expect(payment.getId()).toBe(1);
    expect(payment.getAmount()).toBe(100);
    expect(payment.getDescription()).toBe('Test payment');
    expect(payment.getUser()).toBe(user);
    expect(payment.getCategory()).toBe(category);
});

test('should throw error if amount is missing in the constructor', () => {
    expect(() => {
        new Payment({ amount: 0, user, category });
    }).toThrow('Amount is required');
});

test('should create a Payment instance using from() method', () => {
    const payment = Payment.from({
        id: 1,
        amount: 100,
        date: new Date(),
        description: 'Test payment',
        userId: userMock.id,
        categoryId: categoryMock.id,
        user: userMock,
        category: categoryMock,
    });

    expect(payment.getId()).toBe(1);
    expect(payment.getAmount()).toBe(100);
    expect(payment.getDescription()).toBe('Test payment');
    expect(payment.getUser()).toBeInstanceOf(User);
    expect(payment.getCategory()).toBeInstanceOf(Category);
});
