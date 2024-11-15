import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';
import { User } from '../model/user';

const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

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

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const role = await userService.getUserRoleByUsername(user.username);
        const token = await userService.loginUser(user);
        const response = { token: token, role: role };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

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

userRouter.delete('/delete', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.query as { username: string };
        const response = await userService.deleteUser(username);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

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
