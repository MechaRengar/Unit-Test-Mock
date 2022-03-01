import express from 'express';
import controllers from '../controllers/productlines';
import errorHandler from '../middlewares/errors/handleErrors';
import auth from '../middlewares/auth';
import validators from '../middlewares/validators/productLine';
import keys from '../config/keys';

const router = express.Router();
const { ADMIN, MANAGER, STAFF, CUSTOMER } = keys.ROLE;
const { handleError } = errorHandler;
const { fnGetAll, fnCreate, fnUpdate, fnDelete } = controllers;
const { validateProductLine, validateUpdate } = validators;

router.get(
  '/',
  auth([ADMIN, MANAGER, STAFF, CUSTOMER]),
  handleError(fnGetAll),
);

router.post(
  '/',
  auth([ADMIN, MANAGER, STAFF]),
  validateProductLine,
  handleError(fnCreate),
);

router.patch(
  '/:productLine',
  auth([ADMIN, MANAGER, STAFF]),
  validateUpdate,
  handleError(fnUpdate),
);

router.delete(
  '/:productLine',
  auth([ADMIN, MANAGER, STAFF]),
  handleError(fnDelete),
);

export default router;

