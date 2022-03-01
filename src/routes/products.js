import express from 'express';
import auth from '../middlewares/auth';
import {
  create,
  getAll,
  getProductByCode,
  update,
  deleted,
} from '../controllers/products';
import {
  productUpdateValidate,
  productValidate,
} from '../middlewares/validators/products';
import checkData from '../middlewares/checkData/product';
import errorHandler from '../middlewares/errors/handleErrors';
import keys from '../config/keys';

const { ADMIN, MANAGER, STAFF, CUSTOMER } = keys.ROLE;
const {
  checkBodyProductCode,
  checkParamsProductCode,
} = checkData;
const { handleError } = errorHandler;
const router = express.Router();

router
  .post(
    '/',
    auth([ADMIN, MANAGER, STAFF]),
    productValidate,
    checkBodyProductCode,
    handleError(create),
  )

  .get(
    '/',
    auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
    handleError(getAll),
  )

  .get(
    '/:productCode',
    auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
    checkParamsProductCode,
    handleError(getProductByCode),
  )

  .patch(
    '/:productCode',
    auth([ADMIN, MANAGER, STAFF]),
    productUpdateValidate,
    checkParamsProductCode,
    handleError(update),
  )

  .delete(
    '/:productCode',
    auth([ADMIN, MANAGER, STAFF]),
    checkParamsProductCode,
    handleError(deleted),
  );

export default router;
