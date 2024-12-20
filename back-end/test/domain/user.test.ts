import { User } from '../../model/user';

describe('User validation', () => {
    it('should throw an error if username is missing', () => {
        expect(() => {
            new User({
                username: '',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user',
            });
        }).toThrow('Username is required');
    });

    it('should throw an error if first name is missing', () => {
        expect(() => {
            new User({
                username: 'johndoe',
                firstName: '',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user',
            });
        }).toThrow('First name is required');
    });

    it('should throw an error if last name is missing', () => {
        expect(() => {
            new User({
                username: 'johndoe',
                firstName: 'John',
                lastName: '',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user',
            });
        }).toThrow('Last name is required');
    });

    it('should throw an error if email is missing', () => {
        expect(() => {
            new User({
                username: 'johndoe',
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                password: 'password123',
                role: 'user',
            });
        }).toThrow('Email is required');
    });

    it('should throw an error if password is missing', () => {
        expect(() => {
            new User({
                username: 'johndoe',
                firstName: 'John',
                lastName: 'Doe',
                password: '',
                email: 'john.doe@example.com',
                role: 'user',
            });
        }).toThrow('Password is required');
    });

    it('should throw an error if role is missing', () => {
        expect(() => {
            new User({
                username: 'johndoe',
                firstName: 'John',
                lastName: 'Doe',
                role: '',
                email: 'john.doe@example.com',
                password: 'password123',
            });
        }).toThrow('Role is required');
    });

    it('should not throw an error if all fields are provided', () => {
        expect(() => {
            new User({
                username: 'johndoe',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user',
            });
        }).not.toThrow();
    });
});
