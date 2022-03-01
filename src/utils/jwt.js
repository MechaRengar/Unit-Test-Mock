import jwt from 'jsonwebtoken';
import keys from '../config/keys';

const jwtSecret = keys.JWT_SECRET;

const signToken = (data) => {
  let token = null;
  if (data.employeeNumber) {
    const { username, employeeNumber, role, officeCode } = data;
    token = jwt.sign(
      { username, employeeNumber, role, officeCode },
      jwtSecret,
      { expiresIn: '1h' },
    );
  }
  if (data.customerNumber) {
    const { username, customerNumber, role } = data;
    token = jwt.sign(
      { username, customerNumber, role },
      jwtSecret,
      { expiresIn: '1h' },
    );
  }
  if (!token) {
    return {
      status: 'failure',
      message: 'Sign token failed',
    };
  }

  return token;
};

const verifyToken = (token) => {
  if (!token) {
    return {
      status: 'failure',
      message: 'Could not find token',
    };
  }
  const match = jwt.verify(token, jwtSecret);

  return match;
};

export default {
  signToken,
  verifyToken,
};
