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

    try {
        const response = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error: any) {
        // Optional: distinguish between different error types here
        throw new Error(error.message || 'Network or server error');
    }
};

const getLoggedInUser = async (): Promise<User | null> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/users/me`, {
            method: 'GET',
            credentials: 'include', // sends cookies including HTTP-only ones
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            // Unauthorized: likely no token or invalid token
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch logged-in user');
        }

        const user = await response.json();
        return user; // { username, role }
    } catch (error: any) {
        console.error('Error fetching logged-in user:', error);
        throw new Error(error.message || 'Network or server error');
    }
};

const logout = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to logout user');
    }
    return response.json();
};

const getUserByEmail = async (email: string): Promise<User> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/getUserByEmail?email=${email}`, {
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
    const response = await fetch(`${apiUrl}/users/getUserByUsername?username=${username}`, {
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
    const response = await fetch(`${apiUrl}/users/delete?username=${username}`, {
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

const changePassword = async (username: string, currentPassword: string, newPassword: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/changePassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, currentPassword, newPassword }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
    }
    return response.json();
};

const forgotPassword = async (email: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
    }
    return response.json();
};

const resetPassword = async (token: string, newPassword: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
    }
    return response.json();
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
    getLoggedInUser,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
};

// Export the UserService object
export default UserService;
