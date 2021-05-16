import * as express from 'express';
export default function(err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
  console.error(err);
  res.status(500).send('Internal Server Error');
};