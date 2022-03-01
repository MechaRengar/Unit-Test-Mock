import CustomError from '../middlewares/errors/CustomError';
import Employee from '../models/Employee';
import logger from '../utils/logger';
import Customer from '../models/Customer';

const { getCustomers,
  getById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = Customer;

const { getEmployeeNumbers } = Employee;

const getAll = async (req, res) => {
  const { employeeNumber, role } = res.locals.auth;
  let customers;
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const filter = { limit, page };
  try {
    if (role === 1) {
      customers = await getCustomers(filter);

      return res.status(200).json({
        total: customers.length,
        customers,
      });
    }
    const listOfEmployeeNumbers = await getEmployeeNumbers(employeeNumber);
    customers = await getCustomers(filter);

    const allowedCustomers = customers.filter(
      customer => listOfEmployeeNumbers.includes(customer.salesRepEmployeeNumber),
    );

    return res.status(200).json({
      total: allowedCustomers.length,
      data: allowedCustomers,
    });
  } catch (error) {
    logger.error('Error @getAll', error);
    throw new CustomError('Internal Server Error', 500);
  }
};

const getByNumber = async (req, res) => {
  const { employeeNumber, role } = res.locals.auth;
  const customerNumber = req.params.customerNumber;
  try {
    if (role === 1) {
      const customer = await getById(customerNumber);
      if (customer.message) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      return res.status(200).json(customer);
    }

    const customer = await getById(customerNumber);
    if (customer.message) return res.status(204).json({ message: 'Customer not found' });

    const listOfEmployeeNumbers = await getEmployeeNumbers(employeeNumber);
    if (listOfEmployeeNumbers.includes(customer.salesRepEmployeeNumber)) {
      return res.status(200).json(customer);
    }

    return res.status(403).json({
      message: 'Forbidden',
    });
  } catch (error) {
    logger.error('Error @getByNumber', error);
    throw new CustomError('Internal Server Error', 500);
  }
};

const create = async (req, res) => {
  const { employeeNumber, role } = res.locals.auth;
  let newCustomer;
  try {
    if (role === 1) {
      newCustomer = await createCustomer(req.body);
      if (!newCustomer) {
        return res.status(204).json({
          message: 'Create failed',
        });
      }

      return res.status(200).json({ message: 'success', result: newCustomer });
    }
    const listOfEmployeeNumbers = await getEmployeeNumbers(employeeNumber);
    if (listOfEmployeeNumbers.includes(req.body.salesRepEmployeeNumber)) {
      newCustomer = await createCustomer(req.body);
    } else {
      throw new CustomError('Forbidden', 403);
    }

    if (!newCustomer) {
      return res.status(204).json({
        message: 'Create failed',
      });
    }

    return res.status(200).json({ message: 'success', result: newCustomer });
  } catch (error) {
    if (error.statusCode === 403) {
      logger.warn('Warning @create', error);
      throw new CustomError('Forbidden', 403);
    }
    logger.error('Error @create', error);
    throw new CustomError('Internal Server Error', 500);
  }
};

const update = async (req, res) => {
  const customerNumber = req.params.customerNumber;
  try {
    const result = await updateCustomer(customerNumber, req.body);

    return res.status(200).json(result);
  } catch (error) {
    logger.error('Error @update', error);
    throw new CustomError('Internal Server Error', 500);
  }
};

const destroy = async (req, res) => {
  const customerNumber = req.params.customerNumber;
  try {
    const result = await deleteCustomer(customerNumber);

    if (result.customer === 0) {
      return res.status(204).json({
        message: 'No customer has been deleted',
      });
    }

    return res.status(200).json({
      message: 'Successfully delete customer',
    });
  } catch (error) {
    logger.error('Error @destroy', error);
    throw new CustomError('Internal Server Error', 500);
  }
};

export default {
  getAll,
  getByNumber,
  create,
  update,
  destroy,
};
