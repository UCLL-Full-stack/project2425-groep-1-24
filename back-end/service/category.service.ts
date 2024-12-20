import categoryDB from '../repository/category.db';
import { Category } from '../model/category';
import e from 'express';

const getAllCategories = async (): Promise<Category[]> => {
    return await categoryDB.getAllCategories();
};

const getCategoryByName = async (name: string): Promise<Category> => {
    if (name == undefined || name == null || name == '') {
        throw new Error('Category name is required');
    }
    const category = await categoryDB.getCategoryByName(name);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
};

const createCategory = async (name: string): Promise<Category> => {
    if (name == undefined || name == null || name == '') {
        throw new Error('Category name is required');
    }

    const category = await categoryDB.getCategoryByName(name);
    if (!!category) {
        throw new Error('Category already exists');
    }
    return await categoryDB.createCategory(name);
};

export default {
    getAllCategories,
    getCategoryByName,
    createCategory,
};
