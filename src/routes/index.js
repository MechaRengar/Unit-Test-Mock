import express from 'express';
import controllers from '../controllers/users';
import validators from '../middlewares/validators/users';
import checkData from '../middlewares/checkData/user';
import errorHandler from '../middlewares/errors/handleErrors';

import offices from './offices';
import employees from './employees';
import customers from './customers';
import productlines from './productlines';
import products from './products';
import orders from './orders';

const router = express.Router();

const {
  handleError,
} = errorHandler;

const {
  fnRegister,
  fnLogin,
} = controllers;
const {
  vaidateRegister,
  vaidateLogin,
} = validators;
const {
  checkUserName,
  checkDataRef,
} = checkData;


router.post(
  '/register',
  vaidateRegister,
  checkUserName,
  checkDataRef,
  handleError(fnRegister),
);

router.post(
  '/login',
  vaidateLogin,
  handleError(fnLogin),
);

router.use('/offices', offices);
router.use('/employees', employees);
router.use('/customers', customers);
router.use('/productlines', productlines);
router.use('/products', products);
router.use('/orders', orders);

router.all('*', (req, res) => res.status(404).send({
  message: `${req.originalUrl} not found.`,
}));

export default router;
