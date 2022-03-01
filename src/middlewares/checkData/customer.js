import Customer from '../../models/Customer';
import Employee from '../../models/Employee';
import logger from '../../utils/logger';

const { getById } = Customer;
const { getEmployeeNumbers } = Employee;

const checkCustomerNumber = async (req, res, next) => {
  const customer = await getById(req.body.customerNumber);
  if (customer.message) {
    return next();
  }
  logger.warn(`${req.method} ${req.originalUrl} - ${res.locals.auth.username} - Duplicate data of customer number`);

  return res.status(500).json({
    status: 'failure',
    message: 'Duplicate data of customer number',
  });
};

const checkSaleRepCustomerNumber = async (req, res, next) => {
  const listOfEmployeeNumbers = getEmployeeNumbers(req.body.salesRepEmployeeNumber);

  if (!listOfEmployeeNumbers) {
    logger.error(`${req.body.salesRepEmployeeNumber} does not exist`);

    return res.status(400).json({ status: 'failure', message: `${req.body.salesRepEmployeeNumber} does not exist` });
  }

  return next();
};

const checkSaleRepEmployeeNumber = async (req, res, next) => {
  const { employeeNumber, role } = res.locals.auth;
  const customerNumber = req.params.customerNumber;

  const target = await getById(customerNumber);

  if (target.message) return res.status(404).json({ message: 'Not Found' });

  switch (role) {
    case 1:
      return next();
    case 4:
      {
        if (customerNumber === res.locals.auth.customerNumber) {
          return next();
        }

        return res.status(403).json({ message: 'Forbidden' });
      }
    default:
      {
        const listOfEmployeeNumbers = await getEmployeeNumbers(employeeNumber);

        if (listOfEmployeeNumbers.includes(target.salesRepEmployeeNumber)) {
          return next();
        }

        return res.status(403).json({ message: 'Forbidden' });
      }
  }
};

export default {
  checkCustomerNumber,
  checkSaleRepCustomerNumber,
  checkSaleRepEmployeeNumber,
};
