import User from '../../models/User';
import Customer from '../../models/Customer';
import Employee from '../../models/Employee';
import logger from '../../utils/logger';
import knex from '../../config/database';
import CustomError from '../errors/CustomError';

const checkUserName = async (req, res, next) => {
  const result = await User.getById(req.body.username);
  if (!result.status) {
    logger.error(`${req.method} - ${req.originalUrl} - username is already registered`);

    return res.status(500).json({ status: 'failure', message: 'Username is already registered' });
  }

  return next();
};

const checkDataRef = async (req, res, next) => {
  if (req.body.customer) {
    const dataCustomer = req.body.customer;
    // create
    const transaction = await knex.transaction();
    try {
      const checkCusomerNumber = await User
        .query()
        .where('customerNumber', dataCustomer.customerNumber);
      if (checkCusomerNumber.length > 0) {
        return res.status(400).json({
          message: 'Duplicate data of customer number in users\'s table',
        });
      }
      const checkCustomer = await Customer
        .query()
        .findById(dataCustomer.customerNumber);
      if (checkCustomer) {
        return res.status(400).json({
          message: 'Duplicate data of customer number in customers\'s table',
        });
      }
      if (dataCustomer.salesRepEmployeeNumber) {
        const checkEmployee = await Employee.query()
          .findById(dataCustomer.salesRepEmployeeNumber);
        if (!checkEmployee) {
          return res.status(400).json({
            message: 'Could not find sales rep employee number',
          });
        }
      }

      const newCustomer = await Customer
        .query(transaction)
        .insertAndFetch(dataCustomer);

      await transaction.commit();
      req.body.customerNumber = newCustomer.customerNumber;

      return next();
    } catch (error) {
      logger.error(`${req.method} - ${req.originalUrl} - create customer failed before register`, error);
      await transaction.rollback();
      throw new CustomError('Internal Server Error', 500);
    }
  }

  // data register has value of customerNumber
  if (req.body.customerNumber) {
    // check duplicate data customerNumber in users's table
    const user = await User.query().where('customerNumber', req.body.customerNumber);
    if (user.length === 0) {
      // check value of employeeNumber in employees's table is right
      const customer = await Customer.getById(req.body.customerNumber);
      if (customer.message) {
        logger.error(`${req.method} - ${req.originalUrl} - Could not find customer with customer number ${req.body.customerNumber}`);

        return res.status(404).json({ status: 'failure', message: `Could not find customer with customer number ${req.body.customerNumber}` });
      }

      return next();
    }
    logger.error(`${req.method} - ${req.originalUrl} - Duplicate data of customer number ${req.body.customerNumber}`);

    return res.status(500).json({ status: 'failure', message: `Duplicate data of customer number ${req.body.customerNumber}` });
  }

  const { username, employeeNumber, role, officeCode } = res.locals.auth;
  const message = `${req.method} - ${req.originalUrl} - ${username}`;

  // data register has value of employeeNumber
  const user = await User.query().where('employeeNumber', req.body.employeeNumber);
  // check duplicate data employeeNumber in users's table
  if (!user) {
    logger.error(`${message} - Duplicate data of employee number ${req.body.employeeNumber}`);

    return res.status(500).json({ status: 'failure', message: `Duplicate data of employee number ${req.body.employeeNumber}` });
  }
  // check value of employeeNumber in customers's table is right
  const employee = await Employee.getById(req.body.employeeNumber);
  if (!employee) {
    logger.error(`${message} - Could not find employee with employee number ${req.body.employeeNumber}`);

    return res.status(404).json({ status: 'failure', message: `Could not find employee with employee number ${req.body.employeeNumber}` });
  }
  switch (role) {
    case 1:
      return next();
    case 2:
      {
        if (employeeNumber === employee.reportsTo || officeCode === employee.officeCode) {
          return next();
        }
        logger.error(`${message} - Forbidden: Register employee`);

        return res.status(403).json({ status: 'failure', message: 'Forbidden' });
      }
    default:
      {
        logger.error(`${message} - Forbidden: Staff cannot register employee`);

        return res.status(403).json({ status: 'failure', message: 'Forbidden' });
      }
  }
};

export default {
  checkUserName,
  checkDataRef,
};
