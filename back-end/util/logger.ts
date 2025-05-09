// src/config/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file'; // For rotating logs daily or by size

const { combine, timestamp, printf } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Configure the logger
const logger = winston.createLogger({
    level: 'info', // Default level
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        // Log to console
        new winston.transports.Console({ format: winston.format.simple() }),
        // Log to daily rotating file
        new winston.transports.DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '5m', // Keep logs for last 5 minutes
        }),
    ],
});

export default logger;
