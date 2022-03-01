import { Model } from 'objection';
import knex from '../config/database';
import OrderDetail from './OrderDetail';
import CustomError from '../middlewares/errors/CustomError';
import logger from '../utils/logger';

class Order extends Model {
  static get tableName() {
    return 'orders';
  }
  static get idColumn() {
    return 'orderNumber';
  }
  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'orderNumber',
        'orderDate',
        'requiredDate',
        'status',
        'comments',
        'customerNumber',
      ],
      properties: {
        orderNumber: { type: 'integer' },
        orderDate: { type: 'string' },
        requiredDate: { type: 'string' },
        shippedDate: { type: ['string', 'null'] },
        status: {
          type: 'string',
          enum: [
            'On Hold',
            'In Process',
            'Shipped',
            'Disputed',
            'Resolved',
            'Cancelled',
          ],
        },
        comments: {
          type: ['string', 'null'],
          maxLength: 4000,
        },
        customerNumber: { type: 'integer' },
      },
    };
  }
  static relationMappings() {
    return {
      orderDetails: {
        relation: Model.HasManyRelation,
        modelClass: OrderDetail,
        join: {
          from: 'orders.orderNumber',
          to: 'orderdetails.orderNumber',
        },
      },
    };
  }

  static async getOrders(filter) {
    try {
      const { page, limit } = filter;

      return await Order.query()
        .where('customerNumber', filter.customerNumber)
        .limit(limit)
        .offset(limit * (page - 1));
    } catch (error) {
      logger.error(`function getOrders - ${error.message}`);
      throw new CustomError(error.message, 500);
    }
  }

  static async getById(orderNumber) {
    try {
      const result = await Order.query()
        .findById(orderNumber)
        .withGraphFetched({
          orderDetails: true,
        });

      return result;
    } catch (error) {
      logger.error(`function getById - ${error.message}`);
      throw new CustomError(error.message, 500);
    }
  }

  static async createOrder(data) {
    const transaction = await knex.transaction();
    try {
      const { order, orderDetails } = data;
      const orderNum = await Order.query(transaction)
        .insertAndFetch(order);
      const orderDetailsNum = await OrderDetail.query(transaction)
        .insertGraph(orderDetails);

      await transaction.commit();

      return {
        order: orderNum,
        orderDetails: orderDetailsNum,
      };
    } catch (error) {
      logger.error(`function createOrder - ${error.message}`);
      await transaction.rollback();
      throw new CustomError(error.message, 500);
    }
  }

  static async updateOrder(orderNumber, data) {
    try {
      const result = await Order.query()
        .patchAndFetchById(orderNumber, data);

      return result;
    } catch (error) {
      logger.error(`function updateOrder by number ${orderNumber} - ${error.message}`);
      throw new CustomError(error.message, 500);
    }
  }

  static async deleteOrder(orderNumber) {
    const transaction = await knex.transaction();
    try {
      const orderDetailsNum = await OrderDetail
        .query(transaction).delete().where('orderNumber', orderNumber);

      const orderNum = await Order.query(transaction)
        .deleteById(orderNumber);

      await transaction.commit();

      return {
        order: orderNum,
        orderDetails: orderDetailsNum,
      };
    } catch (error) {
      logger.error(`function deleteOrder by number ${orderNumber} - ${error.message}`);
      await transaction.rollback();
      throw new CustomError(error.message, 500);
    }
  }
}

export default Order;
