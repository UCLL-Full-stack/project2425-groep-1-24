import { User } from '../model/user';
import { Payment } from '../model/payment';
import database from './database';
import { de } from 'date-fns/locale';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();

        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting all users');
    }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: {
                email: email,
            },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting the user by email');
    }
};

const getUserByUsername = async (username: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { username: username },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting the user by username');
    }
};

const createUser = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
): Promise<User> => {
    try {
        const newUserPrisma = await database.user.create({
            data: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: role,
            },
        });

        return User.from(newUserPrisma);
    } catch (error: any) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const deleteUser = async (username: string): Promise<string> => {
    try {
        await database.user.delete({
            where: { username: username },
        });
        return 'User deleted successfully';
    } catch (error: any) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};

const updateUser = async (username: string, { ...updates }: Partial<User>): Promise<User> => {
    try {
        const updatedUserPrisma = await database.user.update({
            where: { username: username },
            data: {
                ...updates,
            },
        });
        return User.from(updatedUserPrisma);
    } catch (error: any) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

export default {
    getAllUsers,
    getUserByEmail,
    getUserByUsername,
    createUser,
    deleteUser,
    updateUser,
};
