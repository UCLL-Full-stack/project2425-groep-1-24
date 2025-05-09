import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRouter from './controller/user.router';
import paymentRouter from './controller/payment.router';
import categoryRouter from './controller/category.router';
import fs from 'fs';
import https from 'https';
import http from 'http';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import HTTPlogger from './util/HTTPlogger';

const app = express();

// Load TLS certificate and key
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// dotenv configuration
dotenv.config();

// Ports
const port = 443;
const httpPort = 80;

// Security headers
app.use(helmet());
app.use(
    cors({
        origin: 'https://localhost:8080',
        credentials: true, // ⬅️ Important to allow cookies
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Middleware
app.use(HTTPlogger);

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/users', userRouter);
app.use('/payments', paymentRouter);
app.use('/categories', categoryRouter);

// Health check
app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

//* Swagger
const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BudgetWise API',
            version: '1.0.0',
        },
    },
    apis: ['*controller/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'CoursesError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

// HTTP → HTTPS redirect
http.createServer((req, res) => {
    res.writeHead(301, {
        Location: `https://${req.headers.host}${req.url}`,
    });
    res.end();
}).listen(httpPort, () => {
    console.log(`HTTP redirect server running on port ${httpPort}`);
});

// HTTPS server
https.createServer(credentials, app).listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
});
