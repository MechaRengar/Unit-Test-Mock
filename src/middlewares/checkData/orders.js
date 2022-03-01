import knex from '../../config/database';
import Order from '../../models/Order';
import Customer from '../../models/Customer';
import Employee from '../../models/Employee';
import logger from '../../utils/logger';
import CustomError from '../errors/CustomError';

const {
  getById,
} = Order;

const checkQueryCustomerNum = async (req, res, next) => {
  if (req.query.customerNumber) {
    if (res.locals.auth.role === 4 && req.query.customerNumber !== res.locals.auth.customerNumber) {
      return res.json({
        message: 'Could not find orders of another customer',
      });
    }

    const customer = await Customer.getById(req.query.customerNumber);
    if (customer.message) {
      return res.json({
        status: 'failure',
        message: customer.message,
      });
    }

    return next();
  }

  return next();
};

const checkDuplicateOrdNum = async (req, res, next) => {
  try {
    const id = req.body.order.orderNumber;
    const result = await getById(id);

    if (!result) {
      return next();
    }

    return res.json({
      message: `Duplicate data of order number ${id}`,
    });
  } catch (error) {
    logger.error('POST /orders - check Duplicate Order Number', error);
    throw new CustomError('Internal Server Error', 500);
  }
};

const checkParamsOrdNum = async (req, res, next) => {
  try {
    const { role } = res.locals.auth;
    const id = req.params.orderNumber;
    const result = await getById(id);
    if (!result) {
      return res.json({
        message: `Could not find order with order number ${req.params.orderNumber}`,
      });
    }

    if (role === 4 && result.customerNumber !== res.locals.auth.customerNumber) {
      return res.json({
        message: 'Forbidden.',
      });
    }

    return next();
  } catch (error) {
    logger.error(`${req.method} /orders/${req.params.orderNumber} - update and create order - ${res.locals.auth.username}`, error);
    throw new CustomError('Internal Server Error', 500);
  }
};

const createOrUpdateCustomer = async (req, res, next) => {
  const transaction = await knex.transaction();
  const { username, role } = res.locals.auth;
  try {
    if (req.body.create) {
      const data = req.body.create;
      if (role === 4) {
        logger.warn(`POST /orders - create new customer - ${username} - Forbidden`);

        return res.json({
          message: 'Forbidden',
        });
      }
      const checkDup = await Customer
        .query(transaction)
        .findById(data.customerNumber);

      if (!checkDup) {
        if (data.salesRepEmployeeNumber) {
          const checkEmployee = await Employee
            .query(transaction)
            .findById(data.salesRepEmployeeNumber);

          if (!checkEmployee) {
            return res.json({
              message: 'Could not find sales rep employee',
            });
          }
          const newCustomer = await Customer
            .query(transaction)
            .insertAndFetch(data);

          if (!newCustomer) {
            return res.json({
              message: 'Create new customer failed before create order',
            });
          }
          req.body.order.customerNumber = data.customerNumber;
          await transaction.commit();

          return next();
        }
        const newCustomer = await Customer
          .query(transaction)
          .insertAndFetch(data);

        if (!newCustomer) {
          return res.json({
            status: 'failure',
            message: 'Create new customer failed before create order',
          });
        }
        req.body.order.customerNumber = data.customerNumber;

        return next();
      }
      logger.error(`POST /orders - create new customer - ${username} - duplicate data`);

      return res.json({
        status: 'failure',
        message: 'Duplicate data of customer number',
      });
    }
    if (!req.body.update) {
      req.body.order.customerNumber = req.body.customerNumber;

      return next();
    }
    // update customer => next();
    let customerNumber;
    if (role === 4 && res.locals.auth.customerNumber !== req.body.customerNumber) {
      return res.json({
        message: 'Forbidden.',
      });
    }
    if (role === 4 && req.body.customerNumber === res.locals.auth.customerNumber) {
      customerNumber = res.locals.auth.customerNumber;
    } else {
      customerNumber = req.body.customerNumber;
    }

    await Customer
      .query(transaction)
      .patchAndFetchById(customerNumber, req.body.update);

    req.body.order.customerNumber = customerNumber;

    await transaction.commit();

    return next();
  } catch (error) {
    logger.error(`POST /orders - update and create order - ${username}`, error);
    await transaction.rollback();
    throw new CustomError('Internal Server Error', 500);
  }
};

const checkUpdateOrder = async (req, res, next) => {
  try {
    const { role } = res.locals.auth;
    const orderNumber = req.params.orderNumber;

    const order = await Order.query().findById(orderNumber);
    if (role === 1) return next();
    if (role === 4 && res.locals.auth.customerNumber === order.customerNumber) {
      if (req.body.status !== 'Cancelled') {
        return res.json({
          message: 'Forbidden',
        });
      }
      if (order.status === 'In Process') return next();

      return res.json({
        message: 'Your order has been processed, you cannot cancel it. Please submit a return request when the order is shipped or contact the seller for assistance.',
      });
    }

    const customer = await Customer.query()
      .select('salesRepEmployeeNumber')
      .findById(order.customerNumber);

    const { salesRepEmployeeNumber } = customer;
    const { employeeNumber } = res.locals.auth;

    const eNumbers = await Employee.query()
      .select('employeeNumber')
      .where('reportsTo', employeeNumber)
      .orWhere('employeeNumber', employeeNumber);

    const listSaleRepAccept = eNumbers.map(e => e.employeeNumber);
    if (listSaleRepAccept.includes(salesRepEmployeeNumber)) return next();

    return res.json({
      message: 'Forbidden: You could not update this order',
    });
  } catch (error) {
    logger.error(`${req.method} /orders/${req.params.orderNumber} - update order - ${res.locals.auth.username}`, error);
    throw new CustomError('Internal Server Error', 500);
  }
};

export default {
  checkQueryCustomerNum,
  checkDuplicateOrdNum,
  checkParamsOrdNum,
  createOrUpdateCustomer,
  checkUpdateOrder,
};
