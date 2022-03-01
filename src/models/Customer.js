import { Model } from 'objection';
import knex from '../config/database';
import Order from './Order';
import Payment from './Payment';
import logger from '../utils/logger';
import CustomError from '../middlewares/errors/CustomError';
import User from './User';

class Customer extends Model {
  static get tableName() {
    return 'customers';
  }

  static get idColumn() {
    return 'customerNumber';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'customerNumber',
        'customerName',
        'contactLastName',
        'contactFirstName',
        'phone',
        'addressLine1',
        'city',
        'country',
        'salesRepEmployeeNumber',
      ],

      properties: {
        customerNumber: { type: 'integer', minimum: 1 },
        customerName: { type: 'string', minLength: 5, maxLength: 50 },
        contactLastName: { type: 'string', minLength: 3, maxLength: 50 },
        contactFirstName: { type: 'string', minLength: 3, maxLength: 50 },
        phone: { type: 'string', minLength: 8, maxLength: 20 },
        addressLine1: { type: 'string', minLength: 10, maxLength: 50 },
        addressLine2: {
          type: ['string', 'null'],
          minLength: 10,
          maxLength: 50,
        },
        city: { type: 'string', minLength: 2, maxLength: 50 },
        state: { type: ['string', 'null'], minLength: 2, maxLength: 50 },
        postalCode: { type: ['string', 'null'], minLength: 5, maxLength: 15 },
        country: { type: 'string', minLength: 2, maxLength: 50 },
        salesRepEmployeeNumber: { type: ['integer', 'null'], minimum: 1 },
        creditLimit: {
          type: ['number', 'null'],
          minimum: 0,
          maximum: 10000000000,
        },
        role: 4,
      },
    };
  }

  static relationMappings() {
    return {
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'customers.customerNumber',
          to: 'orders.customerNumber',
        },
      },
      payments: {
        relation: Model.HasManyRelation,
        modelClass: Payment,
        join: {
          from: 'customers.customerNumber',
          to: 'payments.customerNumber',
        },
      },
    };
  }

  static async getCustomers(filter) {
    try {
      const { page, limit } = filter;

      const result = await Customer.query()
        .limit(limit)
        .offset(limit * (page - 1));

      return result;
    } catch (error) {
      logger.error('Error @getCustomers', error);
      throw new CustomError('Internal Server Error', 500);
    }
  }

  static async getById(customerNumber) {
    try {
      const result = await Customer
        .query()
        .findById(customerNumber);

      if (!result) {
        return {
          message: 'Customer not found',
        };
      }

      return result;
    } catch (error) {
      logger.error('Error @getById', error);
      throw new CustomError('Internal Server Error', 500);
    }
  }

  static async createCustomer(data) {
    try {
      const result = await Customer.query().insertAndFetch(data);

      return result;
    } catch (error) {
      logger.error('Error @getById', error);
      throw new CustomError('Internal Server Error', 500);
    }
  }

  static async updateCustomer(customerNumber, data) {
    try {
      const result = await Customer.query().patchAndFetchById(customerNumber, data);

      return result;
    } catch (error) {
      logger.error('Error @getById', error);
      throw new CustomError('Internal Server Error', 500);
    }
  }

  static async deleteCustomer(customerNumber) {
    const transaction = await knex.transaction();
    try {
      const payment = await Payment.query(transaction).delete().where('customerNumber', customerNumber);
      const user = await User.query(transaction).delete().where('customerNumber', customerNumber);
      const result = await Customer.query(transaction).deleteById(customerNumber);

      await transaction.commit();

      return {
        payments: payment,
        user,
        customer: result,
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error @deleteCustomer', error);
      throw new CustomError('Internal Server Error', 500);
    }
  }
}

export default Customer;
