import jwt from 'jsonwebtoken';
import * as express from 'express';
import AuthService from '../../services/auth.service'

// export const authenticateJWT = (req: express.Request & {user:any}, res: express.Response, next: express.NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//       const token = authHeader.split(' ')[1];

//       jwt.verify(token, AuthService.accessTokenSecret, (err, user) => {
//           if (err) {
//               return res.sendStatus(403);
//           }

//           req.user = user;
//           next();
//       });
//   } else {
//       res.sendStatus(401);
//   }
// };

export function authJWT() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){
    const targetMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      try {
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
      } catch(err) {
        next(err);
      }
    }

    return descriptor;
  };
}