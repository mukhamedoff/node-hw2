import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import { AuthController } from './routers/controllers/auth.controller';
import usersRouter from './routers/users.routing';
import groupsRouter from './routers/groups.routing';

import logger from './middleware/loggerMiddleware';
import errorLogger from './middleware/errorLogger';

const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'qwe123asd456zxc789'
};
const app = express();
const PORT = 5000;
const authController = new AuthController();
var corsOptions = {
    origin: 'https://localhost:5000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.post('/login', authController.login);
app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use(errorLogger);

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});