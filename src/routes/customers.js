import express from 'express';
import controllers from '../controllers/customers';
import auth from '../middlewares/auth';
import validation from '../middlewares/validators/customers';
import errorHandler from '../middlewares/errors/handleErrors';
import checkData from '../middlewares/checkData/customer';
import keys from '../config/keys';

const { ADMIN, MANAGER, STAFF, CUSTOMER } = keys.ROLE;

const {
  checkCustomerNumber,
  checkSaleRepEmployeeNumber,
} = checkData;
const {
  handleError,
} = errorHandler;

const {
  getAll,
  getByNumber,
  create,
  update,
  destroy,
} = controllers;
const { validateCustomer, validateCustomerUpdate } = validation;
const router = express.Router();

router.get(
  '/:customerNumber',
  auth([ADMIN, MANAGER, STAFF]),
  handleError(getByNumber),
);

router.get(
  '/',
  auth([ADMIN, MANAGER, STAFF]),
  handleError(getAll),
);

router.post(
  '/',
  auth([ADMIN, MANAGER, STAFF]),
  validateCustomer,
  checkCustomerNumber,
  handleError(create),
);

router.patch(
  '/:customerNumber',
  auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
  validateCustomerUpdate,
  checkSaleRepEmployeeNumber,
  handleError(update),
);

router.delete(
  '/:customerNumber',
  auth([ADMIN, MANAGER, STAFF]),
  checkSaleRepEmployeeNumber,
  handleError(destroy),
);

export default router;
