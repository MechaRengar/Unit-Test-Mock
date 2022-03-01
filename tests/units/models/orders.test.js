import sinon from 'sinon';
import { assert, expect } from 'chai';
import Order from '../../../src/models/Order';
import OrderDetail from '../../../src/models/OrderDetail';
import dataFake from '../../fake-data/orders';

const {
  tableName,
  idColumn,
  jsonSchema,
  relationMappings,
  getOrders,
  getById,
  createOrder,
  updateOrder,
  deleteOrder,
} = Order;

const {
  schema,
  orders,
  order,
  validate,
  validateOrders,
  dataCreate,
  resultCreateOrderDt,
  filter,
} = dataFake;

describe('Order', () => {
  describe('#model', () => {
    it('Success get table name', () => {
      expect(tableName).to.eql('orders');
    });

    it('Success get value of id column', () => {
      expect(idColumn).to.eql('orderNumber');
    });

    it('Success get schema of table', () => {
      expect(jsonSchema).to.eql(schema);
    });

    it('Success get type of relation data of table', () => {
      const result = relationMappings();

      expect(result).to.be.a('object');
    });

    it('Failed get type of relation data of table', async () => {
      try {
        relationMappings();
        assert.fail('Failed');
      } catch (error) {
        expect(error.message).to.eql('Failed');
      }
    });
  });

  describe('getOrders', () => {
    afterEach(() => sinon.restore());

    it('Success get orders of customer with filter', async () => {
      const offset = sinon.fake.returns(Promise.resolve(orders));
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const result = await getOrders(filter);
      assert(offset.called);
      const valid = validateOrders(result);

      expect(valid).to.eql(true);
    });

    it('Success get orders of customer with limit and page, no other field filte', async () => {
      const offset = sinon.fake.returns(Promise.resolve(orders));
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const result = await getOrders({
        page: 1,
        limit: 5,
      });
      assert(offset.called);
      const valid = validateOrders(result);

      expect(valid).to.eql(true);
    });

    it('Failed to get orders, should throw an error', async () => {
      const offset = sinon.fake.throws('Failed to get orders');
      const fakeQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Order, 'query', fakeQuery);
      try {
        await getOrders(filter);
        assert(offset.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to get orders');
      }
    });
  });

  describe('getById', () => {
    afterEach(() => sinon.restore());

    it('Success get order with details by order number', async () => {
      const withGraphFetched = sinon.fake.returns(Promise.resolve(order));
      const fakeQuery = () => ({
        findById: () => ({ withGraphFetched }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const orderNumber = 10345;
      const result = await getById(orderNumber);
      assert(withGraphFetched.called);

      const valid = validate(result);
      expect(valid).to.eql(true);
    });

    it('If the result has no order with number entered, should return a message', async () => {
      const withGraphFetched = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({
        findById: () => ({ withGraphFetched }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const orderNumber = 10345;
      const result = await getById(orderNumber);
      assert(withGraphFetched.called);

      expect(result).to.be.null;
    });

    it('Failed to get order by number, should throw an error', async () => {
      const withGraphFetched = sinon.fake.throws('Failed to get order by number');
      const fakeQuery = () => ({
        findById: () => ({ withGraphFetched }),
      });
      sinon.replace(Order, 'query', fakeQuery);

      const orderNumber = 10345;
      try {
        await getById(orderNumber);
        assert(withGraphFetched.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to get order by number');
      }
    });
  });

  describe('createOrder', () => {
    afterEach(() => sinon.restore());

    it('Success create an order', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(dataCreate.order));
      const insertGraph = sinon.fake.returns(Promise.resolve(dataCreate.orderDetails));
      const fakeQuery1 = () => ({ insertAndFetch });
      const fakeQuery2 = () => ({ insertGraph });
      sinon.replace(Order, 'query', fakeQuery1);
      sinon.replace(OrderDetail, 'query', fakeQuery2);

      const result = await createOrder(dataCreate);
      assert(insertAndFetch.called);
      assert(insertGraph.called);

      expect(result).to.eql(dataCreate);
    });

    it('If the order is create failure, should return a message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      const insertGraph = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery1 = () => ({ insertAndFetch });
      const fakeQuery2 = () => ({ insertGraph });
      sinon.replace(Order, 'query', fakeQuery1);
      sinon.replace(OrderDetail, 'query', fakeQuery2);

      const result = await createOrder(dataCreate);
      assert(insertAndFetch.called);
      assert(insertGraph.called);

      expect(result).to.eql({
        order: null,
        orderDetails: null,
      });
    });

    it('Failed to create an order, should throw an error', async () => {
      const insertAndFetch = sinon.fake.throws('Failed to create order');
      const insertGraph = sinon.fake.returns(Promise.resolve(resultCreateOrderDt));
      const fakeQuery1 = () => ({ insertAndFetch });
      const fakeQuery2 = () => ({ insertGraph });
      sinon.replace(Order, 'query', fakeQuery1);
      sinon.replace(OrderDetail, 'query', fakeQuery2);

      try {
        await createOrder(dataCreate);
        assert(insertAndFetch.called);
        assert(insertGraph.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to create order');
      }
    });
  });

  describe('updateOrder', () => {
    afterEach(() => sinon.restore());

    it('Success update info of order', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(order));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const orderNumber = 10345;
      const data = {
        shippedDate: '2004-11-25',
        status: 'Shipped',
      };
      const result = await updateOrder(orderNumber, data);
      assert(patchAndFetchById.called);

      const valid = validate(result);
      expect(valid).to.eql(true);
    });

    it('If the result is update failure, should return a message', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const orderNumber = 10345;
      const data = {
        shippedDate: '2004-11-25',
        status: 'Shipped',
      };
      const result = await updateOrder(orderNumber, data);
      assert(patchAndFetchById.called);

      expect(result).to.be.null;
    });

    it('Failed to update order, should throw an error', async () => {
      const patchAndFetchById = sinon.fake.throws('Failed to update order');
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Order, 'query', fakeQuery);

      const orderNumber = 10345;
      const data = {
        shippedDate: '2004-11-25',
        status: 'Shipped',
      };
      try {
        await updateOrder(orderNumber, data);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to update order');
      }
    });
  });

  describe('deleteById', () => {
    afterEach(() => sinon.restore());

    it('Success delete order and order details by id order number', async () => {
      const where = sinon.fake.returns(Promise.resolve(3));
      const deleteById = sinon.fake.returns(Promise.resolve(1));
      const fakeQuery1 = () => ({
        delete: () => ({ where }),
      });
      const fakeQuery2 = () => ({ deleteById });
      sinon.replace(OrderDetail, 'query', fakeQuery1);
      sinon.replace(Order, 'query', fakeQuery2);

      const orderNumber = 10345;
      const result = await deleteOrder(orderNumber);
      assert(where.called);
      assert(deleteById.called);

      expect(result).to.eql({
        order: 1,
        orderDetails: 3,
      });
    });

    it('If order has been deleted with no order details, should return a message', async () => {
      const where = sinon.fake.returns(Promise.resolve(0));
      const deleteById = sinon.fake.returns(Promise.resolve(0));
      const fakeQuery1 = () => ({
        delete: () => ({
          where,
        }),
      });
      const fakeQuery2 = () => ({ deleteById });
      sinon.replace(OrderDetail, 'query', fakeQuery1);
      sinon.replace(Order, 'query', fakeQuery2);

      const orderNumber = 10345;
      const result = await deleteOrder(orderNumber);
      assert(where.called);
      assert(deleteById.called);

      expect(result).to.eql({
        order: 0,
        orderDetails: 0,
      });
    });

    it('Failed to delete order details by number, should throw an error', async () => {
      const where = sinon.fake.throws('Failed to delete order details');
      const deleteById = sinon.fake.returns(Promise.resolve(1));
      const fakeQuery1 = () => ({
        delete: () => ({
          where,
        }),
      });
      const fakeQuery2 = () => ({ deleteById });
      sinon.replace(OrderDetail, 'query', fakeQuery1);
      sinon.replace(Order, 'query', fakeQuery2);

      const orderNumber = 10345;
      try {
        await deleteOrder(orderNumber);
        assert(deleteById.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to delete order details');
      }
    });

    it('Failed to delete order, should throw an error', async () => {
      const where = sinon.fake.returns(Promise.resolve(1));
      const deleteById = sinon.fake.throws('Failed to delete order');
      const fakeQuery1 = () => ({
        delete: () => ({
          where,
        }),
      });
      const fakeQuery2 = () => ({ deleteById });
      sinon.replace(OrderDetail, 'query', fakeQuery1);
      sinon.replace(Order, 'query', fakeQuery2);

      const orderNumber = 10345;
      try {
        await deleteOrder(orderNumber);
        assert(deleteById.called);
      } catch (error) {
        expect(error.message).to.eql('Failed to delete order');
      }
    });
  });
});
