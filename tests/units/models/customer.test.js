
import { assert, expect } from 'chai';
import sinon from 'sinon';
import Customer from '../../../src/models/Customer';
import dataFake from '../../fake-data/customers';
import Payment from '../../../src/models/Payment';
import User from '../../../src/models/User';

const {
  tableName,
  idColumn,
  jsonSchema,
  relationMappings,
  getCustomers,
  getById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = Customer;

const {
  schema,
  customers,
  customer,
  customerUpdate,
} = dataFake;

describe('Customer', () => {
  describe('#model', () => {
    it('Success get table name', () => {
      expect(tableName).to.eql('customers');
    });

    it('Success get value of id column', () => {
      expect(idColumn).to.eql('customerNumber');
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

  describe('getCustomers', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Success', async () => {
      const offset = sinon.fake.returns(Promise.resolve(customers));
      const filter = {
        limit: 10,
        page: 1,
      };
      const fakeQuery = () => ({
        limit: () => ({
          offset,
        }),
      });

      sinon.replace(Customer, 'query', fakeQuery);
      const result = await getCustomers(filter);
      assert(offset.called);
      expect(result).to.eql(customers);
    });
    it('Failed', async () => {
      const offset = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });

      sinon.replace(Customer, 'query', fakeQuery);
      try {
        await getCustomers(10, 1);
        assert(offset.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('getCustomerByNumber', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Success get customer by number', async () => {
      const findById = sinon.fake.returns(Promise.resolve(customer));

      const fakeQuery = () => ({ findById });

      sinon.replace(Customer, 'query', fakeQuery);
      const result = await getById(103);
      assert(findById.called);

      expect(result).to.eql(customer);
    });

    it('If no data of customer, return a message: Customer not found', async () => {
      const findById = sinon.fake.returns(null);

      const fakeQuery = () => ({ findById });
      sinon.replace(Customer, 'query', fakeQuery);

      const result = await getById(9999);
      expect(result).to.eql({ message: 'Customer not found' });
    });

    it('Failed get customer by number, throw an Error', async () => {
      const findById = sinon.fake.throws('Internal Server Error');

      const fakeQuery = () => ({ findById });
      sinon.replace(Customer, 'query', fakeQuery);

      try {
        await getById(103);
        assert(findById.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('createCustomer', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Success', async () => {
      const insertAndFetch = sinon.fake.returns(customer);
      const fakeQuery = () => ({ insertAndFetch });

      sinon.replace(Customer, 'query', fakeQuery);
      const result = await createCustomer({
        customerNumber: 602,
        customerName: 'Atelier graphique',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine ',
        phone: '40.32.2555',
        addressLine1: '54, rue Royale',
        addressLine2: null,
        city: 'Nantes',
        state: null,
        postalCode: '44000',
        country: 'France',
        salesRepEmployeeNumber: 1370,
        creditLimit: 21000,
      });
      assert(insertAndFetch.called);

      expect(result).to.eql(customer);
    });

    it('If create faild, should throw an error', async () => {
      const insertAndFetch = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Customer, 'query', fakeQuery);
      try {
        await createCustomer({
          customerNumber: 602,
          customerName: 'Atelier graphique',
          contactLastName: 'Schmitt',
          contactFirstName: 'Carine ',
          phone: '40.32.2555',
          addressLine1: '54, rue Royale',
          addressLine2: null,
          city: 'Nantes',
          state: null,
          postalCode: '44000',
          country: 'France',
          salesRepEmployeeNumber: 1370,
          creditLimit: 21000,
        });
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
    it('If create success with result is null, should return a message', async () => {
      const insertAndFetch = sinon.fake.returns(null);
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Customer, 'query', fakeQuery);

      try {
        await createCustomer({
          customerNumber: 602,
          customerName: 'Atelier graphique',
          contactLastName: 'Schmitt',
          contactFirstName: 'Carine ',
          phone: '40.32.2555',
          addressLine1: '54, rue Royale',
          addressLine2: null,
          city: 'Nantes',
          state: null,
          postalCode: '44000',
          country: 'France',
          salesRepEmployeeNumber: 1370,
          creditLimit: 21000,
        });
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql({ message: 'Create Customer Failed' });
      }
    });
  });

  describe('updateCustomer', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Success', async () => {
      const patchAndFetchById = sinon.fake.returns(customerUpdate);
      const fakeQuery = () => ({ patchAndFetchById });

      sinon.replace(Customer, 'query', fakeQuery);
      const id = 602;
      const data = {
        customerName: 'Atelier graphique UPDATE',
      };

      const result = await updateCustomer(id, data);

      expect(result).to.eql(customerUpdate);
    });
    it('If the id of customer is number type string, should success update', async () => {
      const patchAndFetchById = sinon.fake.returns(customerUpdate);
      const fakeQuery = () => ({ patchAndFetchById });

      sinon.replace(Customer, 'query', fakeQuery);
      const id = '602';
      const data = {
        customerName: 'Atelier graphique UPDATE',
      };

      const result = await updateCustomer(id, data);

      expect(result).to.eql(customerUpdate);
    });
    // return null => message: update failed
    // throw new Error => Internal server error
    it('If the id of customer is null, should return a message', async () => {
      const patchAndFetchById = sinon.fake.returns(null);
      const fakeQuery = () => ({ patchAndFetchById });

      sinon.replace(Customer, 'query', fakeQuery);
      const id = '601';
      const data = {
        customerName: 'Atelier graphique UPDATE',
      };

      try {
        await updateCustomer(id, data);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.message).to.eql({ message: 'Update failed' });
      }
    });
  });

  describe('deleteCustomer', async () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Success', async () => {
      const where = sinon.fake.returns(Promise.resolve(1));
      const where1 = sinon.fake.returns(Promise.resolve(1));
      const deleteById = sinon.fake.returns(Promise.resolve(1));

      const fakeQuery = () => ({
        delete: () => ({
          where,
        }),
      });
      const fakeQuery1 = () => ({
        delete: () => ({
          where: where1,
        }),
      });
      const fakeQueryCustomer = () => ({ deleteById });

      sinon.replace(Customer, 'query', fakeQueryCustomer);
      sinon.replace(Payment, 'query', fakeQuery1);
      sinon.replace(User, 'query', fakeQuery);

      const result = await deleteCustomer(601);
      assert(deleteById.called);
      assert(where1.called);
      assert(where.called);

      expect(result).to.eql({
        payments: 1,
        user: 1,
        customer: 1,
      });
    });
    it('If any Model can\'t be deleted , throw error', async () => {
      const where = sinon.fake.throws('Internal Server Error');
      const deleteById = sinon.fake.returns(Promise.resolve(1));

      const fakeQueryCustomer = () => ({ deleteById });
      const fakeQuery = () => ({
        delete: () => ({
          where,
        }),
      });

      sinon.replace(Customer, 'query', fakeQueryCustomer);
      sinon.replace(Payment, 'query', fakeQuery);
      sinon.replace(User, 'query', fakeQuery);

      try {
        await deleteCustomer(601);
        assert(deleteById.called);
        assert(where.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });
});
