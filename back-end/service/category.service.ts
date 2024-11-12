import categoryDB from '../repository/category.db';
import { Category } from '../model/category';
import e from 'express';

const getAllCategories = async (): Promise<Category[]> => {
    return await categoryDB.getAllCategories();
};

export default {
    getAllCategories,
};
