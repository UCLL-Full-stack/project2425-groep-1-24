import express, { NextFunction, Request, Response } from 'express';
import categoryService from '../service/category.service';

const categoryRouter = express.Router();

categoryRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
});

export default categoryRouter;
