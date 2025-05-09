import express, { NextFunction, Request, Response } from 'express';
import paymentService from '../service/payment.service';
import { PaymentInput } from '../types';
import logger from '../util/logger';

const paymentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Retrieve a list of payments
 *     responses:
 *       200:
 *         description: A list of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   amount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   description:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/createPayment:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a new payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.00
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-01T00:00:00Z"
 *               description:
 *                 type: string
 *                 example: "Payment for services"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 amount:
 *                   type: number
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

paymentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching all payments');
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        logger.error('Error fetching payments: ', error);
        next(error);
    }
});

paymentRouter.post('/createPayment', async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating a new payment');
    try {
        const payment = <PaymentInput>req.body;
        const createdPayment = await paymentService.createPayment(payment);
        res.status(201).json(createdPayment);
    } catch (error) {
        logger.error('Error creating payment: ', error);
        console.log(error);
        next(error);
    }
});

export default paymentRouter;
