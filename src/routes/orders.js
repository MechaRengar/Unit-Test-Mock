import express from 'express';
import controllers from '../controllers/orders';
import errorHandler from '../middlewares/errors/handleErrors';
import auth from '../middlewares/auth';
import validators from '../middlewares/validators/orders';
import checkData from '../middlewares/checkData/orders';
import keys from '../config/keys';

const { ADMIN, MANAGER, STAFF, CUSTOMER } = keys.ROLE;
const router = express.Router();

const {
  fnGetOrders,
  fnGetById,
  fnCreateOrder,
  fnUpdateOrder,
  fnDeleteOrder,
} = controllers;

const {
  handleError,
} = errorHandler;

const {
  validateQuery,
  validateCreate,
  validateUpdate,
} = validators;

const {
  checkQueryCustomerNum,
  checkDuplicateOrdNum,
  checkParamsOrdNum,
  createOrUpdateCustomer,
  checkUpdateOrder,
} = checkData;

router.get(
  '/',
  auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
  validateQuery,
  checkQueryCustomerNum,
  handleError(fnGetOrders),
);

router.get(
  '/:orderNumber',
  auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
  checkParamsOrdNum,
  handleError(fnGetById),
);

router.post(
  '/',
  auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
  validateCreate,
  checkDuplicateOrdNum,
  createOrUpdateCustomer,
  handleError(fnCreateOrder),
);

router.patch(
  '/:orderNumber',
  auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
  validateUpdate,
  checkParamsOrdNum,
  checkUpdateOrder,
  handleError(fnUpdateOrder),
);

router.delete(
  '/:orderNumber',
  auth([ADMIN, MANAGER, STAFF]),
  handleError(fnDeleteOrder),
);

export default router;
