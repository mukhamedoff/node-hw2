import jwt from 'jsonwebtoken';
import * as express from 'express';
import AuthService from '../services/auth.service'

export const authenticateJWT = (req: any, res: any, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, AuthService.accessTokenSecret, (err: any, user: any) => {
      if (err) {
          return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
      res.sendStatus(401);
  }
};