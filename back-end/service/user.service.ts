import userDB from '../repository/user.db';
import { User } from '../model/user';
import { UserInput } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mailer from '../util/mailer';

// Load environment variables
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
}

const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

const validateMail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateUser = async (username?: string, password?: string, role?: string) => {
    // Validate username
    if (username === undefined || username === null || username === '') {
        throw new Error('Username is required');
    }

    // Check if user already exists
    const user = await userDB.getUserByUsername(username);
    if (user) {
        throw new Error('User already exists');
    }

    // Validate password
    if (password === undefined || password === null || password === '') {
        throw new Error('Password is required');
    }
    // Enforce password policy
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPolicy.test(password)) {
        throw new Error(
            'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
        );
    }

    // Validate role
    if (role === undefined || role === null || role === '') {
        throw new Error('Role is required');
    }
};

const changePassword = async (
    username: string,
    currentPassword: string,
    newPassword: string
): Promise<string> => {
    const user = await userDB.getUserByUsername(username);
    if (!user) {
        throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.getPassword());
    if (!isValidPassword) {
        throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userDB.updatePassword(username, hashedNewPassword);

    return 'Password updated successfully';
};

const getAllUsers = async (): Promise<User[]> => {
    return await userDB.getAllUsers();
};

const getUserByEmail = async (email: string): Promise<User> => {
    if (!validateMail(email)) {
        throw new Error('Invalid email address: ' + email);
    }
    const user = await userDB.getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const getUserByUsername = async (username: string): Promise<User> => {
    // Validate username
    if (username === undefined || username === null || username === '') {
        throw new Error('Username is required');
    }

    const user = await userDB.getUserByUsername(username);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const getUserRoleByUsername = async (username: string): Promise<string> => {
    // Validate username
    if (username === undefined || username === null || username === '') {
        throw new Error('Username is required');
    }

    const user = await userDB.getUserByUsername(username);
    if (!user) {
        throw new Error('User not found');
    }
    return user.getRole();
};

const loginUser = async ({ username, password }: UserInput): Promise<string> => {
    const user = await userDB.getUserByUsername(username);
    if (!user) {
        throw new Error('Username is incorrect.');
    }
    const isValidPassword = await bcrypt.compare(password, user.getPassword());
    if (!isValidPassword) {
        throw new Error('Username and/or password is incorrect.');
    }
    return generateJwtToken(username, user.getRole());
};

const generateJwtToken = (username: string, role: string): string => {
    const payload = { username: username, role: role };
    const expiresIn = `${process.env.JWT_EXPIRES_HOURS}`;
    const options = { expiresIn, issuer: 'libremory' };
    try {
        return jwt.sign(payload, jwtSecret, options);
    } catch (error) {
        console.log('Error generating JWT token' + error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
};

const generateResetToken = (username: string): string => {
    return jwt.sign({ username }, jwtSecret, {
        expiresIn: '15m',
        issuer: 'yourapp',
    });
};

const createUser = async ({
    username,
    firstName,
    lastName,
    email,
    password,
    role,
}: UserInput): Promise<{ message: string; user: User }> => {
    // Validate username
    await validateUser(username, password, role);
    if (!validateMail(email)) {
        throw new Error('Invalid email address: ' + email);
    }
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
    });

    // Save the new user in the database
    await userDB.createUser(
        newUser.getUsername(),
        newUser.getFirstName(),
        newUser.getLastName(),
        newUser.getEmail(),
        newUser.getPassword(),
        newUser.getRole()
    );

    return { message: 'User registered successfully', user: newUser };
};

const deleteUser = async (username: string): Promise<string> => {
    if (username === undefined || username === null || username === '') {
        throw new Error('Invalid username given');
    }

    const user = await userDB.getUserByUsername(username);
    if (!user) {
        throw new Error('No customers found with given username: ' + username);
    }

    await userDB.deleteUser(username);
    return 'User deleted successfully';
};

const updateUser = async (username: string, updates: Partial<User>): Promise<string> => {
    if (username === undefined || username === null || username === '') {
        throw new Error('Invalid username given');
    }

    const user = await userDB.getUserByUsername(username);
    if (!user) {
        throw new Error('No customers found with given username: ' + username);
    }
    const updatedEmail = (updates as { email?: string }).email;

    if (updatedEmail) {
        if (!validateMail(updatedEmail)) {
            throw new Error('Invalid email address: ' + updatedEmail);
        }
    }

    try {
        let updateData: Partial<User> = { ...updates };
        const updatedPassword = (updates as { password?: string }).password;
        if (updatedPassword) {
            updateData = {
                ...updateData,
                password: await hashPassword(updatedPassword),
            } as Partial<User>;
        }
        await userDB.updateUser(username, updateData);

        return 'User updated successfully';
    } catch (error: any) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

const sendResetEmail = async (email: string): Promise<string> => {
    const user = await userDB.getUserByEmail(email);
    if (!user) throw new Error('User with this email does not exist.');

    const token = generateResetToken(user.getUsername()); // similar to login token
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await mailer.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Click this link to reset your password: ${resetLink}`,
    });

    return 'Reset email sent';
};

const resetPassword = async (token: string, newPassword: string): Promise<string> => {
    if (!token || !newPassword) {
        throw new Error('Token and new password are required');
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        throw new Error(
            'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number.'
        );
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
    } catch (err) {
        throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await userDB.updatePassword(decoded.username, hashedPassword);

    if (!updated) {
        throw new Error('Failed to update password. User not found.');
    }

    return 'Password reset successfully';
};

export default {
    getAllUsers,
    getUserByEmail,
    getUserByUsername,
    getUserRoleByUsername,
    loginUser,
    createUser,
    deleteUser,
    updateUser,
    changePassword,
    sendResetEmail,
    resetPassword,
};
