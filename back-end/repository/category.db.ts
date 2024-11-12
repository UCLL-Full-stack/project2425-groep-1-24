import database from './database';
import { Category } from '../model/category';

const getAllCategories = async (): Promise<Category[]> => {
    try {
        const categoriesprisma = await database.category.findMany();
        return categoriesprisma.map((categoryPrisma) => Category.from(categoryPrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Error getting categories');
    }
};

export default {
    getAllCategories,
};
