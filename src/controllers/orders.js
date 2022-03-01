import Order from '../models/Order';
import CustomError from '../middlewares/errors/CustomError';
import logger from '../utils/logger';

const {
  getOrders,
  getById,
  createOrder,
  updateOrder,
  deleteOrder,
} = Order;

const fnGetOrders = async (req, res) => {
  const { username } = res.locals.auth;
  try {
    req.query.page < 0 || !req.query.page
      ? req.query.page = 1
      : req.query.page;
    req.query.limit < 0 || !req.query.limit
      ? req.query.limit = 10
      : req.query.limit;
    const filter = req.query;
    const orders = await getOrders(filter);

    return res.status(200).json({
      total: orders.length,
      page: filter.page,
      orders,
    });
  } catch (error) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message} - ${username}`);
    throw new CustomError('Failed to get orders', 500);
  }
};

const fnGetById = async (req, res) => {
  const { username } = res.locals.auth;
  const id = req.params.orderNumber;
  try {
    const order = await getById(id);
    if (!order) {
      return res.status(404).json({
        message: `Could not find order with order number ${id}`,
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    logger.error(`${req.method} ${req.originalUrl}/${id} - ${error.message} - ${username}`);
    throw new CustomError(`Failed to get order by order number ${id}`, 500);
  }
};

const fnCreateOrder = async (req, res) => {
  const { username } = res.locals.auth;
  try {
    req.body.order.status = 'In Process';
    const data = {
      order: req.body.order,
      orderDetails: req.body.orderDetails,
      update: req.body.update || null,
      create: req.body.create || null,
    };
    data.order.requiredDate = data.order.requiredDate.toISOString().split('T')[0];
    data.order.orderDate = new Date().toISOString().split('T')[0];

    let orderLineNumber = 1;
    await data.orderDetails.forEach((od) => {
      od.orderNumber = data.order.orderNumber;
      od.orderLineNumber = orderLineNumber;
      orderLineNumber += 1;
    });
    const result = await createOrder(data);

    if (!result.order) {
      return res.status(404).json({
        message: 'No order has been created',
      });
    }

    return res.status(200).json({
      message: `1 order and ${result.orderDetails.length} order details have been created.`,
      order: result.order,
    });
  } catch (error) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message} - ${username}`);
    throw new CustomError('Failed to create order', 500);
  }
};

const fnUpdateOrder = async (req, res) => {
  const { username } = res.locals.auth;
  try {
    const data = req.body;
    switch (data.status) {
      case 'Shipped':
        {
          if (data.requiredDate) {
            return res.status(400).json({
              message: 'To update status is \'Shipped\', you cannot update required date',
            });
          }
          data.shippedDate = new Date().toISOString().split('T')[0];
          break;
        }
      case 'Cancelled':
        {
          if (data.requiredDate) {
            return res.status(400).json({
              message: 'To cancel an order, you cannot update required date',
            });
          }
          break;
        }
      default:
        {
          if (!data.requiredDate) {
            return res.status(400).json({
              message: 'Must update required date',
            });
          }

          data.requiredDate = await data.requiredDate.toISOString().split('T')[0];
          break;
        }
    }
    const result = await updateOrder(req.params.orderNumber, req.body);
    if (!result) {
      return res.status(404).json({
        message: 'Failed to update order',
      });
    }

    return res.status(200).json({
      message: 'Order updated successfully',
      order: result,
    });
  } catch (error) {
    logger.error(`${req.method} ${req.originalUrl}/${req.params.orderNumber} - ${error.message} - ${username}`);
    throw new CustomError('Failed to update order', 500);
  }
};


const fnDeleteOrder = async (req, res) => {
  const { username } = res.locals.auth;
  try {
    const result = await deleteOrder(req.params.orderNumber);

    if (!result.order) {
      return res.status(404).json({
        message: 'No order has been deleted',
      });
    }

    return res.status(200).json({
      message: `${result.order} order and ${result.orderDetails} order details have been deleted.`,
    });
  } catch (error) {
    logger.error(`${req.method} ${req.originalUrl}/${req.params.orderNumber} - ${error.message} - ${username}`);
    throw new CustomError('Failed to delete order', 500);
  }
};

export default {
  fnGetOrders,
  fnGetById,
  fnCreateOrder,
  fnUpdateOrder,
  fnDeleteOrder,
};
