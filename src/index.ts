import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';

import usersRouter from './routers/users.routing';

const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'qwe123asd456zxc789'
};
const app = express();
const PORT = 5000;

app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.use('/users', usersRouter);

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});