import User from '../models/User';
import CustomError from '../middlewares/errors/CustomError';
import logger from '../utils/logger';

const {
  register,
  login,
} = User;

const fnRegister = async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };
    if (req.body.customerNumber) {
      data.customerNumber = req.body.customerNumber;
    }
    if (req.body.employeeNumber) {
      data.employeeNumber = req.body.employeeNumber;
    }

    const result = await register(data);
    if (!result) {
      return res.status(204).json({ message: 'Registration failed' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Register successfully!',
    });
  } catch (error) {
    logger.error(`${req.method} ${req.originalUrl}`, error);

    throw new CustomError('Internal Server Error', 500, 'error');
  }
};

const fnLogin = async (req, res) => {
  const message = 'POST /login';
  try {
    const result = await login(req.body);
    if (result.status === 'failure') {
      return res.status(404).json(result);
    }
    logger.info(`${message} - ${result.message}`);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`${message} - ${error}`);
    throw new CustomError('Login Failed', 500, 'error');
  }
};

export default {
  fnRegister,
  fnLogin,
};
