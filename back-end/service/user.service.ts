import userDB from '../repository/user.db';
import { User } from '../model/user';

const getAllUsers = async (): Promise<User[]> => {
    return await userDB.getAllUsers();
};

export default {
    getAllUsers,
};
