import express, { NextFunction, Request, Response } from 'express';
import paymentService from '../service/payment.service';

const paymentRouter = express.Router();

paymentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
});

export default paymentRouter;
