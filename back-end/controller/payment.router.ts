import express, { NextFunction, Request, Response } from 'express';
import paymentService from '../service/payment.service';
import { PaymentInput } from '../types';

const paymentRouter = express.Router();

paymentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
});

paymentRouter.post('/createPayment', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = <PaymentInput>req.body;
        const createdPayment = await paymentService.createPayment(payment);
        res.status(201).json(createdPayment);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

export default paymentRouter;
