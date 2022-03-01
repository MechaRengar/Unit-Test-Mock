import sinon from 'sinon';
import { assert, expect } from 'chai';
import Customer from '../../../src/models/Customer';
import controllers from '../../../src/controllers/customers';
import dataFake from '../../fake-data/customers';
import Employee from '../../../src/models/Employee';

const {
  getAll,
  getByNumber,
  create,
  update,
  destroy,
} = controllers;
const {
  customerById,
  customers,
  customerByEmployeeNum,
  listOfEmployeeNumber,
  customerUpdate,
  notAllowedCustomer,
} = dataFake;

let res;

describe('Customer\'s controllers', () => {
  describe('getAll', () => {
    before(() => {
      res = {
        status: code => ({
          json: data => ({
            status: code,
            data,
          }),
        }),
      };
    });
    afterEach(() => sinon.restore());

    it('Get all customers successfully by admin, return status code', async () => {
      const offset = sinon.fake.returns(Promise.resolve(customers));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        query: {
          limit: 10,
          pape: 1,
        },
      };
      const fakeQuery = () => ({
        limit: () => ({ offset }),
      });
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await getAll(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      expect(result.data.customers).to.eql(customers);
    });

    it('Get all customers successfully by admin with no limit, return status code', async () => {
      const offset = sinon.fake.returns(Promise.resolve(customers));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        query: {
        },
      };
      const fakeQuery = () => ({
        limit: () => ({ offset }),
      });
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await getAll(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      expect(result.data.customers).to.eql(customers);
    });

    it('Get all customers successfully not by admin, return status code', async () => {
      const offset = sinon.fake.returns(Promise.resolve(customers));
      const orWhere = sinon.fake.returns(Promise.resolve(listOfEmployeeNumber));
      const fakeQuery = () => ({
        select: () => ({
          where: () => ({ orWhere }),
        }),
      });
      const fakeQuery1 = () => ({
        limit: () => ({ offset }),
      });
      sinon.replace(Customer, 'query', fakeQuery1);
      sinon.replace(Employee, 'query', fakeQuery);
      res.locals = {
        auth: {
          username: 'staff',
          employeeNumber: 602,
          role: 2,
        },
      };
      const req = {
        query: {
          limit: 10,
          pape: 1,
        },
      };

      const result = await getAll(req, res);
      assert(orWhere.called);
      assert(offset.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql(customerByEmployeeNum);
    });

    it('Get all customers failed, return status code and message', async () => {
      const offset = sinon.fake.throws('Internal Server Error');
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        query: {
          limit: 10,
          pape: 1,
        },
      };
      const fakeQuery = () => ({
        limit: () => ({ offset }),
      });
      sinon.replace(Customer, 'query', fakeQuery);
      try {
        await getAll(req, res);
        assert.fail();
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('getByNumber', () => {
    before(() => {
      res = {
        status: code => ({
          json: data => ({
            status: code,
            data,
          }),
        }),
      };
    });
    afterEach(() => sinon.restore());

    it('Get customer by customerNumber successfully by admin, return status code', async () => {
      const findById = sinon.fake.returns(Promise.resolve(customerById));
      const fakeQuery = () => ({
        findById,
      });
      sinon.replace(Customer, 'query', fakeQuery);
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        params: {
          customerNumber: 602,
        },
      };

      const result = await getByNumber(req, res);
      assert(findById.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql(customerById);
    });

    it('Get customer by customerNumber successfully not by admin, return status code and data', async () => {
      const findById = sinon.fake.returns(Promise.resolve(customerById));
      const orWhere = sinon.fake.returns(Promise.resolve(listOfEmployeeNumber));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 2,
        },
      };
      const req = {
        params: {
          customerNumber: 602,
        },
      };
      const fakeQuery = () => ({
        select: () => ({
          where: () => ({ orWhere }),
        }),
      });
      const query = () => ({
        findById,
      });
      sinon.replace(Employee, 'query', fakeQuery);
      sinon.replace(Customer, 'query', query);

      const result = await getByNumber(req, res);
      assert(orWhere.called);
      assert(findById.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql(customerById);
    });

    it('Get customer by customerNumber failed, return status code and message', async () => {
      const findById = sinon.fake.throws('Internal Server Error');
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 2,
        },
      };
      const req = {
        params: {
          customerNumber: 602,
        },
      };
      const query = () => ({
        findById,
      });
      sinon.replace(Customer, 'query', query);

      try {
        await getByNumber(req, res);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal Server Error');
      }
    });

    it('Get customer by customerNumber by admin return null, return status code and message', async () => {
      const findById = sinon.fake.returns(Promise.resolve(null));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        params: {
          customerNumber: 602,
        },
      };
      const query = () => ({
        findById,
      });
      sinon.replace(Customer, 'query', query);

      try {
        await getByNumber(req, res);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(204);
        expect(error.message).to.eql('Not Found');
      }
    });

    it('Get customer by customerNumber not by admin return null, return status code and message', async () => {
      const findById = sinon.fake.returns(Promise.resolve(null));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 2,
        },
      };
      const req = {
        params: {
          customerNumber: 602,
        },
      };
      const query = () => ({
        findById,
      });
      sinon.replace(Customer, 'query', query);

      try {
        await getByNumber(req, res);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(204);
        expect(error.message).to.eql('Not Found');
      }
    });

    it('Get customer by customerNumber successfully but got access denied, return status code and message', async () => {
      const findById = sinon.fake.returns(Promise.resolve(notAllowedCustomer));
      const orWhere = sinon.fake.returns(Promise.resolve(listOfEmployeeNumber));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 2,
        },
      };
      const req = {
        params: {
          customerNumber: 600,
        },
      };
      const fakeQuery = () => ({
        select: () => ({
          where: () => ({ orWhere }),
        }),
      });
      const query = () => ({
        findById,
      });
      sinon.replace(Employee, 'query', fakeQuery);
      sinon.replace(Customer, 'query', query);

      try {
        await getByNumber(req, res);
        assert(orWhere.called);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(403);
        expect(error.message).to.eql('Forbidden');
      }
    });
  });

  describe('create', () => {
    before(() => {
      res = {
        status: code => ({
          json: data => ({
            status: code,
            data,
          }),
        }),
      };
    });
    afterEach(() => sinon.restore());

    it('Create customer successfully by admin, return status code and new customer', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(customerById));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        params: {
          customerNumber: 1,
        },
      };
      const fakeQuery = () => ({
        insertAndFetch,
      });
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await create(req, res);
      assert(insertAndFetch.called);
      expect(result.status).to.eql(200);
      expect(result.data.result).to.eql(customerById);
    });

    it('Create customer failed by admin, return a message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        params: {
          customerNumber: 1,
        },
      };
      const fakeQuery = () => ({
        insertAndFetch,
      });
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await create(req, res);
      assert(insertAndFetch.called);
      expect(result.status).to.eql(204);
      expect(result.data).to.eql({
        message: 'Create failed',
      });
    });

    it('Create customer successfully not by admin, return status code and new customer', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(customerById));
      const orWhere = sinon.fake.returns(Promise.resolve(listOfEmployeeNumber));
      res.locals = {
        auth: {
          username: 'staff',
          employeeNumber: 602,
          role: 2,
        },
      };
      const req = {
        body: {
          salesRepEmployeeNumber: 1371,
        },
        params: {
          limit: 10,
          pape: 1,
        },
      };
      const fakeQuery = () => ({
        insertAndFetch,
      });
      const query = () => ({
        select: () => ({
          where: () => ({ orWhere }),
        }),
      });
      sinon.replace(Customer, 'query', fakeQuery);
      sinon.replace(Employee, 'query', query);

      const result = await create(req, res);
      assert(orWhere.called);
      assert(insertAndFetch.called);

      expect(result.status).to.eql(200);
      expect(result.data.result).to.eql(customerById);
    });

    it('Create customer failed, return status code and message', async () => {
      const insertAndFetch = sinon.fake.throws('Internal Server Error');
      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      const req = {
        params: {
          customerNumber: 1,
        },
      };
      const fakeQuery = () => ({
        insertAndFetch,
      });
      sinon.replace(Customer, 'query', fakeQuery);

      try {
        await create(req, res);
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal Server Error');
      }
    });

    it('Create not allowed saleRepEmployeeNumber, return status code and error message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(notAllowedCustomer));
      const orWhere = sinon.fake.returns(Promise.resolve(listOfEmployeeNumber));
      res.locals = {
        auth: {
          username: 'staff',
          employeeNumber: 602,
          role: 2,
        },
      };
      const req = {
        body: {
          salesRepEmployeeNumber: 1000,
        },
        params: {
          limit: 10,
          pape: 1,
        },
      };
      const fakeQuery = () => ({
        insertAndFetch,
      });
      const query = () => ({
        select: () => ({
          where: () => ({ orWhere }),
        }),
      });
      sinon.replace(Customer, 'query', fakeQuery);
      sinon.replace(Employee, 'query', query);

      try {
        await create(req, res);
        assert(orWhere.called);
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.statusCode).to.eql(403);
        expect(error.message).to.eql('Forbidden');
      }
    });

    it('Create not allowed saleRepEmployeeNumber, return status code and error message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      const orWhere = sinon.fake.returns(Promise.resolve(listOfEmployeeNumber));
      res.locals = {
        auth: {
          username: 'staff',
          employeeNumber: 602,
          role: 2,
        },
      };
      const req = {
        body: {
          salesRepEmployeeNumber: 1371,
        },
        params: {
          limit: 10,
          pape: 1,
        },
      };
      const fakeQuery = () => ({
        insertAndFetch,
      });
      const fakeQuery1 = () => ({
        select: () => ({
          where: () => ({ orWhere }),
        }),
      });
      sinon.replace(Customer, 'query', fakeQuery);
      sinon.replace(Employee, 'query', fakeQuery1);

      const result = await create(req, res);
      assert(orWhere.called);
      assert(insertAndFetch.called);

      expect(result.status).to.eql(204);
      expect(result.data).to.eql({ message: 'Create failed' });
    });
  });

  describe('update', () => {
    before(() => {
      res = {
        status: code => ({
          json: data => ({
            status: code,
            data,
          }),
        }),
      };
    });
    afterEach(() => sinon.restore());

    it('Update customer successfully , return status code and customer updated', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(customerUpdate));
      const req = {
        body: {
          employeeName: 'abc',
        },
        params: {
          customerNumber: 1,
        },
      };
      const fakeQuery = () => ({
        patchAndFetchById,
      });
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await update(req, res);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql(customerUpdate);
    });

    it('Update customer failed , return status code and message', async () => {
      const patchAndFetchById = sinon.fake.throws('Internal Server Error');
      const req = {
        body: {
          employeeName: 'abc',
        },
        params: {
          customerNumber: 1,
        },
      };
      const fakeQuery = () => ({
        patchAndFetchById,
      });
      sinon.replace(Customer, 'query', fakeQuery);

      try {
        await update(req, res);
        assert.fail();
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('destroy', () => {
    before(() => {
      res = {
        status: code => ({
          json: data => ({
            status: code,
            data,
          }),
        }),
      };
    });
    afterEach(() => sinon.restore());

    it('Delete customer successfully, return status code and message', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve(1));
      const fakeQuery = () => ({
        deleteById,
      });
      res.locals = {
        auth: {
          employeeNumber: 1,
          role: 1,
          username: 'admin',
        },
      };
      const req = {
        params: {
          customerNumber: 601,
        },
      };
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await destroy(req, res);
      assert(deleteById.called);

      expect(result.status).to.eql(200);
      expect(result.data.message).to.eql('Successfully delete customer');
    });

    it('Delete customer failed , return status code and message', async () => {
      const deleteById = sinon.fake.throws('Internal Server Error');
      const req = {
        body: {
          employeeName: 'abc',
        },
        params: {
          customerNumber: 1,
        },
      };
      const fakeQuery = () => ({
        deleteById,
      });
      sinon.replace(Customer, 'query', fakeQuery);

      try {
        await destroy(req, res);
        assert(deleteById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal Server Error');
      }
    });

    it('Delete customer successfully, return status code and message', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve(0));
      const fakeQuery = () => ({
        deleteById,
      });
      res.locals = {
        auth: {
          employeeNumber: 1,
          role: 1,
          username: 'admin',
        },
      };
      const req = {
        params: {
          customerNumber: 601,
        },
      };
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await destroy(req, res);
      assert(deleteById.called);
      expect(result.status).to.eql(204);
      expect(result.data.message).to.eql('No customer has been deleted');
    });
  });
});
