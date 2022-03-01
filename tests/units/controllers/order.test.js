import sinon from 'sinon';
import { assert, expect } from 'chai';
import controllers from '../../../src/controllers/orders';
import Order from '../../../src/models/Order';
import OrderDetail from '../../../src/models/OrderDetail';
import dataFake from '../../fake-data/orders';

const {
  fnGetOrders,
  fnGetById,
  fnCreateOrder,
  fnUpdateOrder,
  fnDeleteOrder,
} = controllers;
const {
  orders,
  order,
  validate,
  validateOrders,
  reqBodyUpdate1,
  reqBodyUpdate2,
  dataCreate,
  filter,
} = dataFake;

const res = {
  status: code => ({
    json: data => ({
      status: code,
      data,
    }),
  }),
};

describe('Order\'s controllers', () => {
  describe('fnGetOrders', () => {
    afterEach(() => sinon.restore());
    it('Success get orders of customer by customer', async () => {
      const offset = sinon.fake.returns(Promise.resolve(orders));
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        query: {
          filter,
        },
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };

      const result = await fnGetOrders(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      const valid = validateOrders(result.data.orders);

      expect(valid).to.eql(true);
    });

    it('Success get orders of customer by customer, query is invalid', async () => {
      const offset = sinon.fake.returns(Promise.resolve(orders));
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        query: {
          page: -1,
          limit: -1,
        },
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };

      const result = await fnGetOrders(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      const valid = validateOrders(result.data.orders);

      expect(valid).to.eql(true);
    });

    it('Success get orders of customer by employee', async () => {
      const offset = sinon.fake.returns(Promise.resolve(orders));
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        query: {
          customerNumber: 103,
          page: -1,
          limit: -1,
        },
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnGetOrders(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      const valid = validateOrders(result.data.orders);

      expect(valid).to.eql(true);
    });

    it('Success get orders of customer by employee', async () => {
      const offset = sinon.fake.returns(Promise.resolve(orders));
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        query: {
          customerNumber: 103,
          page: 2,
          limit: 10,
        },
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnGetOrders(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      const valid = validateOrders(result.data.orders);

      expect(valid).to.eql(true);
    });

    it('Success get orders of customer, with query of required date, no status', async () => {
      const offset = sinon.fake.returns(Promise.resolve(orders));
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        query: {},
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };

      const result = await fnGetOrders(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      const valid = validateOrders(result.data.orders);

      expect(valid).to.eql(true);
    });

    it('Failed to get orders of customer, should throw an error', async () => {
      const offset = sinon.fake.throws('Failed to get orders');
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        query: {},
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };

      try {
        await fnGetOrders(req, res);
        assert(offset.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to get orders');
      }
    });
  });

  describe('fnGetById', () => {
    afterEach(() => sinon.restore());

    it('Success get order with details by order number', async () => {
      const withGraphFetched = sinon.fake.returns(Promise.resolve(order));
      const fakeQuery = () => ({
        findById: () => ({ withGraphFetched }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10345,
        },
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };
      const result = await fnGetById(req, res);
      assert(withGraphFetched.called);

      expect(result.status).to.eql(200);
      const valid = validate(result.data);
      expect(valid).to.eql(true);
    });

    it('If the result has no order with number entered, should return a message', async () => {
      const withGraphFetched = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({
        findById: () => ({ withGraphFetched }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10345,
        },
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };
      const result = await fnGetById(req, res);
      assert(withGraphFetched.called);

      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        message: `Could not find order with order number ${req.params.orderNumber}`,
      });
    });

    it('Failed to get order by number, should throw an error', async () => {
      const withGraphFetched = sinon.fake.throws('Failed to get order by order number');
      const fakeQuery = () => ({
        findById: () => ({ withGraphFetched }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10345,
        },
        method: 'GET',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };
      try {
        await fnGetById(req, res);
        assert(withGraphFetched.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to get order by order number 10345');
      }
    });
  });

  describe('fnCreateOrder', () => {
    afterEach(() => sinon.restore());

    it('Success update customer and create order by customer', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(dataCreate.order));
      const insertGraph = sinon.fake.returns(Promise.resolve(dataCreate.orderDetails));
      const fakeQuery1 = () => ({ insertAndFetch });
      const fakeQuery2 = () => ({ insertGraph });
      sinon.replace(Order, 'query', fakeQuery1);
      sinon.replace(OrderDetail, 'query', fakeQuery2);

      const req = {
        body: reqBodyUpdate1,
        method: 'POST',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };
      const result = await fnCreateOrder(req, res);
      assert(insertAndFetch.called);
      assert(insertGraph.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: '1 order and 2 order details have been created.',
        order: {
          comments: 'Hi there',
          customerNumber: 103,
          orderDate: '2021-12-25',
          orderNumber: 10427,
          requiredDate: '2021-12-30',
        },
      });
    });

    it('No order has been create, should return a message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      const insertGraph = sinon.fake.returns(Promise.resolve(dataCreate.orderDetails));
      const fakeQuery1 = () => ({ insertAndFetch });
      const fakeQuery2 = () => ({ insertGraph });
      sinon.replace(Order, 'query', fakeQuery1);
      sinon.replace(OrderDetail, 'query', fakeQuery2);

      const req = {
        body: reqBodyUpdate2,
        method: 'POST',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };

      const result = await fnCreateOrder(req, res);
      assert(insertAndFetch.called);
      assert(insertGraph.called);

      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        message: 'No order has been created',
      });
    });

    it('Could not create order, should throws an error', async () => {
      const insertAndFetch = sinon.fake.throws('Failed to create order');
      const insertGraph = sinon.fake.returns(Promise.resolve(dataCreate.orderDetails));
      const fakeQuery1 = () => ({ insertAndFetch });
      const fakeQuery2 = () => ({ insertGraph });
      sinon.replace(Order, 'query', fakeQuery1);
      sinon.replace(OrderDetail, 'query', fakeQuery2);

      const req = {
        body: reqBodyUpdate2,
        method: 'POST',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          customerNumber: 103,
          username: 'customer',
        },
      };
      try {
        await fnCreateOrder(req, res);
        assert(insertAndFetch.called);
        assert(insertGraph.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to create order');
      }
    });
  });
  describe('fnUpdateOrder', () => {
    afterEach(() => sinon.restore());

    it('Success update order by number', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(orders[0]));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Shipped',
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnUpdateOrder(req, res);
      assert(patchAndFetchById.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'Order updated successfully',
        order: orders[0],
      });
    });

    it('Success update order by number', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(orders[0]));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Resolved',
          requiredDate: new Date(),
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnUpdateOrder(req, res);
      assert(patchAndFetchById.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'Order updated successfully',
        order: orders[0],
      });
    });

    it('Success update order by number', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(orders[0]));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Cancelled',
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnUpdateOrder(req, res);
      assert(patchAndFetchById.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'Order updated successfully',
        order: orders[0],
      });
    });

    it('Not accept update status shipped and required date at the same time', async () => {
      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Shipped',
          requiredDate: new Date(),
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnUpdateOrder(req, res);

      expect(result.status).to.eql(400);
      expect(result.data).to.eql({
        message: 'To update status is \'Shipped\', you cannot update required date',
      });
    });

    it('Not accept update status cancelled and required date at the same time', async () => {
      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Cancelled',
          requiredDate: new Date(),
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnUpdateOrder(req, res);

      expect(result.status).to.eql(400);
      expect(result.data).to.eql({
        message: 'To cancel an order, you cannot update required date',
      });
    });

    it('Not accept update another status and no required date at the same time', async () => {
      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Resolved',
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnUpdateOrder(req, res);

      expect(result.status).to.eql(400);
      expect(result.data).to.eql({
        message: 'Must update required date',
      });
    });

    it('Update failure, should return a message', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Shipped',
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnUpdateOrder(req, res);
      assert(patchAndFetchById.called);

      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        message: 'Failed to update order',
      });
    });

    it('Could not update order, should throws an error', async () => {
      const patchAndFetchById = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const req = {
        params: {
          orderNumber: 10427,
        },
        body: {
          status: 'Shipped',
        },
        method: 'PATCH',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      try {
        await fnUpdateOrder(req, res);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to update order');
      }
    });
  });

  describe('fnDeleteOrder', () => {
    afterEach(() => sinon.restore());

    it('Success delete order by number', async () => {
      const where = sinon.fake.returns(Promise.resolve(3));
      const deleteById = sinon.fake.returns(Promise.resolve(1));
      const fakeQuery1 = () => ({
        delete: () => ({
          where,
        }),
      });
      const fakeQuery2 = () => ({ deleteById });
      sinon.replace(OrderDetail, 'query', fakeQuery1);
      sinon.replace(Order, 'query', fakeQuery2);

      const req = {
        params: {
          orderNumber: 10345,
        },
        method: 'DELETE',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnDeleteOrder(req, res);
      assert(where.called);
      assert(deleteById.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: '1 order and 3 order details have been deleted.',
      });
    });

    it('No order has been deleted', async () => {
      const where = sinon.fake.returns(Promise.resolve(null));
      const deleteById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery1 = () => ({
        delete: () => ({
          where,
        }),
      });
      const fakeQuery2 = () => ({ deleteById });
      sinon.replace(OrderDetail, 'query', fakeQuery1);
      sinon.replace(Order, 'query', fakeQuery2);

      const req = {
        params: {
          orderNumber: 10345,
        },
        method: 'DELETE',
        originalUrl: '/orders',
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      const result = await fnDeleteOrder(req, res);
      assert(where.called);
      assert(deleteById.called);

      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        message: 'No order has been deleted',
      });
    });

    it('Failed to delete order, should throw an error', async () => {
      const where = sinon.fake.returns(Promise.resolve(0));
      const deleteById = sinon.fake.throws('Internal Server Error');
      const fakeQuery1 = () => ({
        delete: () => ({
          where,
        }),
      });
      const fakeQuery2 = () => ({ deleteById });
      sinon.replace(OrderDetail, 'query', fakeQuery1);
      sinon.replace(Order, 'query', fakeQuery2);

      const req = {
        params: {
          orderNumber: 10345,
        },
      };
      res.locals = {
        auth: {
          employeeNumber: 1,
          username: 'admin',
        },
      };

      try {
        await fnDeleteOrder(req, res);
        assert(where.called);
        assert(deleteById.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to delete order');
      }
    });
  });
});
