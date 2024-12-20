import { Category } from '@types';

const getAll = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(apiUrl + '/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
    }
    return response.json();
};

const createCategory = async (category: Category) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(apiUrl + '/categories/createCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
    }
    return response.json();
};

const CategoryService = {
    getAll,
    createCategory,
};

export default CategoryService;
