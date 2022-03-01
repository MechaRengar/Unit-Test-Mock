import Employee from '../models/Employee';
import logger from '../utils/logger';
import CustomError from '../middlewares/errors/CustomError';

const {
  createEmployee,
  getEmployees,
  getByOffice,
  getById,
  updateEmployee,
  deleteEmployee,
} = Employee;

const create = async (req, res) => {
  try {
    const employee = await createEmployee(req.body);

    return res.status(200).json({ message: 'success', employee });
  } catch (error) {
    logger.error(`POST/employee/ by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const getAll = async (req, res) => {
  try {
    const filter = req.query;
    if (!filter.page) {
      filter.page = 1;
    }
    if (!filter.limit) {
      filter.limit = 10;
    }
    const employees = await getEmployees(filter);

    return res.status(200).json(employees);
  } catch (error) {
    logger.error(`GET/employees/ by ${res.locals.auth.username}`, error);
    throw new CustomError('Internal server error', 500);
  }
};

const getAllEmployeeByOffice = async (req, res) => {
  try {
    const employees = await getByOffice(res.locals.auth.officeCode);

    return res
      .status(200)
      .json({ message: 'success', total: employees.length, employees });
  } catch (error) {
    logger.error(`GET/employees/ by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const getEmployeeByNumber = async (req, res) => {
  try {
    const employee = await getById(req.params.employeeNumber);

    if (!employee) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Employee not found',
      });
    }

    return res.status(200).json({ message: 'success', employee });
  } catch (error) {
    logger.error(`GET/employee by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const deleted = async (req, res) => {
  try {
    await deleteEmployee(req.params.employeeNumber);

    return res.status(200).json({ message: 'Deleted success' });
  } catch (error) {
    logger.error(`DELETE/deleteEmployee by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const update = async (req, res) => {
  try {
    const employee = await updateEmployee(req.params.employeeNumber, req.body);

    return res.status(200).json({ message: 'success', employee });
  } catch (error) {
    logger.error(`PUT/updateEmployee by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

export {
  create,
  getAll,
  getAllEmployeeByOffice,
  getEmployeeByNumber,
  deleted,
  update,
};
