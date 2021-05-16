import * as express from 'express';
export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
  console.log(`Request method: ${req.method}; Arguments from body: ${JSON.stringify(req.body)}`);
  next();
};