import { User } from '../model/user';
import { Payment } from '../model/payment';
import database from './database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();

        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting all users');
    }
};

export default {
    getAllUsers,
};
