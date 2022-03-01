import express, { response } from 'express';
import errorHandler from '../middlewares/errors/handleErrors';
import emp from '../models/Employee';
import auth from '../middlewares/auth';
import {
  create,
  getAll,
  getAllEmployeeByOffice,
  getEmployeeByNumber,
  update,
  deleted,
} from '../controllers/employees';
import {
  employeeUpdateValidate,
  employeeValidate,
} from '../middlewares/validators/employees';
import {
  checkParamsEmployeeNumber,
  checkGetManager,
  checkEmployeeExists,
  checkReportsTo,
} from '../middlewares/checkData/employee';
import keys from '../config/keys';

const { ADMIN, MANAGER } = keys.ROLE;
const { handleError } = errorHandler;

const router = express.Router();

router
  .post(
    '/',
    auth([ADMIN]),
    employeeValidate,
    checkEmployeeExists,
    checkReportsTo,
    handleError(create),
  )
  .get('/all', auth([ADMIN]), handleError(getAll))

  .get(
    '/:employeeNumber',
    auth([ADMIN, MANAGER]),
    checkParamsEmployeeNumber,
    checkGetManager,
    handleError(getEmployeeByNumber),
  )
  .get('/', auth([MANAGER]), handleError(getAllEmployeeByOffice))
  .patch(
    '/:employeeNumber',
    auth([ADMIN, MANAGER]),
    checkParamsEmployeeNumber,
    employeeUpdateValidate,
    handleError(update),
  )
  .delete(
    '/:employeeNumber',
    auth([ADMIN]),
    checkParamsEmployeeNumber,
    handleError(deleted),
  );

export default router;
