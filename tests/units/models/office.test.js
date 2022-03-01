import { assert, expect } from 'chai';
import { it } from 'mocha';
import sinon from 'sinon';
import Office from '../../../src/models/Office';
import dataFake from '../../fake-data/office';

const {
  tableName,
  idColumn,
  jsonSchema,
  relationMappings,
  getAllOffice,
  getOfficeByOfficeCode,
  createOffice,
  updateOffice,
  deleteOffice,
} = Office;

const {
  schema,
  Offices,
  officeA,
  officeUpdate,
} = dataFake;

describe('Office', () => {
  describe('#model', () => {
    it('Success get table name', () => {
      expect(tableName).to.eql('offices');
    });

    it('Success get value of id column', () => {
      expect(idColumn).to.eql('officeCode');
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

  describe('Get office by officeCode', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Success get office by officeCode field', async () => {
      const findById = sinon.fake.returns(Promise.resolve(officeA));
      const fakeQuery = () => ({ findById });
      sinon.replace(Office, 'query', fakeQuery);

      const result = await getOfficeByOfficeCode('1');

      expect(result).to.eql({
        officeCode: '1',
        city: 'San Francisco',
        phone: '0123456789',
        addressLine1: '100 Market Street',
        addressLine2: 'Suite 300',
        state: 'CA',
        country: 'USA',
        postalCode: '94080',
        territory: 'NA',
      });
    });

    it('If the office is not found, should return a message', async () => {
      const findById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ findById });
      sinon.replace(Office, 'query', fakeQuery);

      const result = await getOfficeByOfficeCode('1');

      expect(result).to.eql({ message: 'Office not found' });
    });

    it('Failed to find a office, should throw an error', async () => {
      const findById = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ findById });
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await getOfficeByOfficeCode('customer');
        assert(findById.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Get all Office ', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Get all office success', async () => {
      const fakeQuery = sinon.fake.returns(Promise.resolve(Offices));

      sinon.replace(Office, 'query', fakeQuery);
      const result = await getAllOffice();

      expect(result).to.eql(Offices);
    });

    it('Get all office fail', async () => {
      const fakeQuery = sinon.fake.returns(Promise.resolve(null));

      sinon.replace(Office, 'query', fakeQuery);
      const result = await getAllOffice();

      expect(result).to.eql({ status: 'failure', message: 'Get office failed' });
    });

    it("can't get all office", async () => {
      const fakeQuery = sinon.fake.returns(Promise.reject('Internal server error'));
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await getAllOffice();
        assert(fakeQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Create office ', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Create office success', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(officeA));
      const fakeQuery = () => ({ insertAndFetch });

      sinon.replace(Office, 'query', fakeQuery);
      const result = await createOffice({
        officeCode: '1',
        city: 'San Francisco',
        phone: '0123456789',
        addressLine1: '100 Market Street',
        addressLine2: 'Suite 300',
        state: 'CA',
        country: 'USA',
        postalCode: '94080',
        territory: 'NA',
      });

      expect(result).to.eql(officeA);
    });

    it('If create faild, should throw an error', async () => {
      const insertAndFetch = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await createOffice({
          officeCode: '1',
          city: 'San Francisco',
          phone: '0123456789',
          addressLine1: '100 Market Street',
          addressLine2: 'Suite 300',
          state: 'CA',
          country: 'USA',
          postalCode: '94080',
          territory: 'NA',
        });
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });

    it('If create success with result is null, should return a message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await createOffice({
          officeCode: '1',
          city: 'San Francisco',
          phone: '0123456789',
          addressLine1: '100 Market Street',
          addressLine2: 'Suite 300',
          state: 'CA',
          country: 'USA',
          postalCode: '94080',
          territory: 'NA',
        });
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql({ message: 'Create Office Failed' });
      }
    });
  });

  describe('Update office', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Update office success', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(officeUpdate));
      const fakeQuery = () => ({ patchAndFetchById });

      sinon.replace(Office, 'query', fakeQuery);
      const id = '1';
      const data = {
        city: 'Update',
      };

      const result = await updateOffice(id, data);

      expect(result).to.eql(officeUpdate);
    });

    it('If the officeCode is null, should return a message', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ patchAndFetchById });

      sinon.replace(Office, 'query', fakeQuery);
      const id = '1';
      const data = {
        city: 'Update',
      };

      try {
        await updateOffice(id, data);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.message).to.eql({ message: 'Update failed' });
      }
    });

    it("can't update a office", async () => {
      const patchAndFetchById = sinon.fake.returns(
        Promise.reject({ message: 'Internal server error', status: 500 }),
      );
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Office, 'query', fakeQuery);
      const id = '1';
      const data = {
        city: 'Update',
      };

      try {
        await updateOffice(id, data);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Delete office', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Delete office success', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve({
        status: 'success',
        message: 'Deleted office',
      }));
      const fakeQuery = () => ({ deleteById });

      sinon.replace(Office, 'query', fakeQuery);

      const result = await deleteOffice('1');

      expect(result).to.eql({
        status: 'success',
        message: 'Successfully delete office with officeCode 1',
      });
    });

    it('If the officeCode is null, should return a message', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ deleteById });

      sinon.replace(Office, 'query', fakeQuery);

      const result = await deleteOffice('1');

      expect(result).to.eql({
        status: 'success',
        message: 'Successfully delete office with officeCode 1',
      });
    });

    it("can't delete Office", async () => {
      const deleteById = sinon.fake.returns(Promise.reject());
      const fakeQuery = () => ({ deleteById });
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await deleteOffice();

        assert(deleteById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });
});
