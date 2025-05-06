import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';
import { User } from '../model/user';

import rateLimit from 'express-rate-limit';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
}
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
}

// Rate limiter for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        status: 'too-many-requests',
        message: 'Too many login attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const userRouter = express.Router();

userRouter.get('/me', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload;
        res.json({ username: decoded.username, role: decoded.role });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   username:
 *                     type: string
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/getUserByEmail:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a user by email
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

userRouter.get('/getUserByEmail', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.query as { email: string };
        try {
            const endUser = await userService.getUserByEmail(email);
            res.status(200).json(endUser);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/getUserByUsername:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a user by username
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

userRouter.get('/getUserByUsername', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.query as { username: string };
        try {
            const endUser = await userService.getUserByUsername(username);
            res.status(200).json(endUser);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "bramcelis"
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: The user logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

userRouter.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const role = await userService.getUserRoleByUsername(user.username);
        const token = await userService.loginUser(user);
        const response = { token: token, role: role };
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // works only over HTTPS
            sameSite: 'strict', // prevents CSRF via cross-site
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

userRouter.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({ message: 'Logged out successfully' });
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const user = <UserInput>req.body;
        const result = await userService.createUser(user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            errorMessage: error.message || 'An error occurred',
        });
    }
});

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user has been deleted
 *       500:
 *         description: Internal server error
 */
userRouter.delete('/delete', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.query as { username: string };
        const response = await userService.deleteUser(username);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/update:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

userRouter.put('/update', async (req: Request, res: Response) => {
    try {
        const { username, ...updates } = req.body as UserInput;
        const updatedUser = await userService.updateUser(username, updates as Partial<User>);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

export default userRouter;
