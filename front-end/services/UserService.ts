import { User } from '@types';

const getAll = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return fetch(apiUrl + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const userLogin = async (user: User) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(apiUrl + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'login failed');
    }

    const lol = response.json();
    console.log(lol);
    return lol;
};

const getUserByEmail = async (email: string): Promise<User> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/fulluser?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user by email');
    }
    return response.json();
};

const getUserByUsername = async (username: string): Promise<User> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/getByUsername?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user by username');
    }
    return response.json();
};

/**
 *
 * @param user
 * @returns
 */
const addUser = async (user: User) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        // Check if the response is not ok (i.e., 400-500 status codes)
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || 'Failed to register user';
            throw new Error(errorMessage);
        }

        // Return the response JSON if available
        return await response.json(); // Return the JSON body of the response
    } catch (error: any) {
        if (error.message === 'User already exists') {
            throw new Error(error.message);
        }
        throw new Error(error.message || 'Failed to register user');
    }
};

const updateUser = async (username: string, updates: Partial<User>) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, ...updates }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Failed to update user');
    }

    return await response.json();
};

const deleteUser = async (username: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/username?username=${username}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
    }
    return response;
};

// Variable UserService is an object with properties
const UserService = {
    getAll,
    userLogin,
    addUser,
    deleteUser,
    updateUser,
    getUserByEmail,
    getUserByUsername,
};

// Export the UserService object
export default UserService;
