import express from 'express';
import auth from '../middlewares/auth';
import controllers from '../controllers/offices';
import errorHandler from '../middlewares/errors/handleErrors';
import validators from '../middlewares/validators/offices';
import checkData from '../middlewares/checkData//offices';
import keys from '../config/keys';

const { ADMIN } = keys.ROLE;

const { validateOffice, validateUpdate } = validators;

const { checkOfficeCodeCreate, checkOfficeCodeUpdate } = checkData;

const { fnGetAll, fnGetOffice, fnCreate, fnUpdate, fnDelete } = controllers;

const { handleError } = errorHandler;

const router = express.Router();

router.get(
  '/',
  auth([ADMIN]),
  handleError(fnGetAll),
);

router.get(
  '/:officeCode',
  auth([ADMIN]),
  handleError(fnGetOffice),
);

router.post(
  '/',
  auth([ADMIN]),
  validateOffice,
  checkOfficeCodeCreate,
  handleError(fnCreate),
);

router.patch(
  '/:officeCode',
  auth([ADMIN]),
  validateUpdate,
  checkOfficeCodeUpdate,
  handleError(fnUpdate),
);

router.delete(
  '/:officeCode',
  auth([ADMIN]),
  checkOfficeCodeUpdate,
  handleError(fnDelete),
);

export default router;
