import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import keys from '../config/keys';
import CustomError from './errors/CustomError';

const jwtSecret = keys.JWT_SECRET;

const auth = roles => (req, res, next) => {
  if (!req.headers.authorization) {
    throw new CustomError('Unauthorized', 401, 'error');
  }
  const token = req.headers.authorization.split(' ')[1];

  const data = jwt.verify(token, jwtSecret);
  if (!data) {
    logger.error(`${req.method} - Verify token failed`);
    throw new CustomError('Can not find token', 400, 'error');
  }
  const role = data.role;
  if (!role) {
    logger.error(`${req.method} - Missing data in token`);
    throw new CustomError('Unauthorized', 401, 'error');
  }
  if (roles.includes(role)) {
    res.locals.auth = data;

    return next();
  }

  logger.error(`${req.method} ${req.originalUrl} - Fobbiden ${data.username}`);
  throw new CustomError('Forbidden', 403, 'error');
};

export default auth;
