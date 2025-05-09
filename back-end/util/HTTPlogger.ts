// src/middlewares/loggerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const HTTPlogger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const logMessage = `${method} ${url}`;

    logger.info(logMessage); // Log the incoming request

    res.on('finish', () => {
        const statusCode = res.statusCode;
        logger.info(`Response status: ${statusCode} for ${logMessage}`); // Log response status after the request is processed
    });

    next();
};

export default HTTPlogger;
