import express, { NextFunction, Request, Response } from 'express';
import categoryService from '../service/category.service';
import logger from '../util/logger';

const categoryRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Retrieve a list of categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/createCategory:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Category"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

categoryRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching all categories');
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        logger.error('Error fetching categories', error);
        next(error);
    }
});

categoryRouter.post('/createCategory', async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating a new category');
    try {
        const { name } = req.body;
        if (!name) {
            throw new Error('Name is required');
        }
        const category = await categoryService.createCategory(name);
        res.status(201).json(category);
    } catch (error) {
        logger.error('Error creating category', error);
        next(error);
    }
});

export default categoryRouter;
