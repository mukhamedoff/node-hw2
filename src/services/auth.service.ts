import jwt from 'jsonwebtoken';

const accessTokenSecret = 'accessTokenSecret';

const login = (payload: any) => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: '24h' });
}

export default {
  login,
  accessTokenSecret
}