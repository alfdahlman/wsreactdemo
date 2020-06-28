import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/keys';
import { submissionComplete } from '../utils/utils';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization){
    return submissionComplete(res, 401, 'Unathorized');
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err){
      return submissionComplete(res, 401, 'Unathorized');
    }

  next();

  })
}
