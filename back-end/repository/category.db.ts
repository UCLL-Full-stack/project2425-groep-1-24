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

const getCategoryByName = async (name: string): Promise<Category | null> => {
    try {
        const categoryPrisma = await database.category.findFirst({
            where: {
                name: name,
            },
        });
        return categoryPrisma ? Category.from(categoryPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting the category by name');
    }
};

const createCategory = async (name: string, description: string): Promise<Category> => {
    try {
        const categoryPrisma = await database.category.create({
            data: {
                name: name,
                description: description,
            },
        });
        return Category.from(categoryPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while creating a category');
    }
};

export default {
    getAllCategories,
    getCategoryByName,
    createCategory,
};
