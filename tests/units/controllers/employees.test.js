import { assert, expect } from 'chai';
import sinon from 'sinon';
import {
  create,
  deleted,
  getAll,
  getAllEmployeeByOffice,
  getEmployeeByNumber,
  update,
} from '../../../src/controllers/employees';
import Employee from '../../../src/models/Employee';
import { employees, employee, res, req } from '../../fake-data/fakeEmployee';

describe('Employee Controller', () => {
  beforeEach(() => {
    req;
    res;
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('getAll Employee', () => {
    it('can get all employees', async () => {
      const offset = sinon.fake.returns(Promise.resolve(employees));
      const mockQuery = () => ({
        where: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await getAll(req, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        total: 3,
        data: employees,
      });
    });

    it('can get all employees with no query', async () => {
      const offset = sinon.fake.returns(Promise.resolve(employees));
      const mockQuery = () => ({
        where: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Employee, 'query', mockQuery);

      const req1 = {
        query: {},
      };
      const result = await getAll(req1, res);
      assert(offset.called);

      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        total: 3,
        data: employees,
      });
    });

    it("can't get all employees", async () => {
      const mockQuery = sinon.fake.throws('Internal Server Error');
      sinon.replace(Employee, 'query', mockQuery);

      try {
        await getAll(req, res);
        assert(mockQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('create Employee', () => {
    it('can create a employee', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(employee));
      const mockQuery = () => ({ insertAndFetch });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await create(req, res);
      assert(insertAndFetch.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({ message: 'success', employee });
    });
    it("can't create a employee", async () => {
      const insertAndFetch = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ insertAndFetch });
      sinon.replace(Employee, 'query', mockQuery);
      try {
        await create(req, res);
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('update Employee', () => {
    it('can update a employee', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(employee));
      const mockQuery = () => ({ patchAndFetchById });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await update(req, res);
      assert(patchAndFetchById.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'success',
        employee,
      });
    });

    it("can't update a employee", async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ patchAndFetchById });
      sinon.replace(Employee, 'query', mockQuery);
      try {
        await update(req, res);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('delete Employee', () => {
    it('can delete Employee', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve());
      const mockQuery = () => ({ deleteById });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await deleted(req, res);
      assert(deleteById.called);
      expect(result.status).to.eql(200);
      expect(result.data.message).to.eql('Deleted success');
    });
    it("can't delete Employee", async () => {
      const deleteById = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ deleteById });
      sinon.replace(Employee, 'query', mockQuery);
      try {
        await deleted(req, res);

        assert(deleteById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('get Employee by officeCode', () => {
    it('can get Employee by getByOffice  ', async () => {
      const where = sinon.fake.returns(Promise.resolve(employees));
      const mockQuery = () => ({ where });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await getAllEmployeeByOffice(req, res);
      assert(where.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'success',
        total: 3,
        employees,
      });
    });
    it("can't get Employee by getByOffice  ", async () => {
      const where = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ where });
      sinon.replace(Employee, 'query', mockQuery);
      try {
        await getAllEmployeeByOffice(req, res);
        assert(where.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('get Employee by Id', () => {
    it(' can get Employee by Id', async () => {
      const findById = sinon.fake.returns(Promise.resolve(employee));
      const mockQuery = () => ({ findById });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await getEmployeeByNumber(req, res);
      assert(findById.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({ message: 'success', employee });
    });

    it(' can not get Employee by Id, should return 404', async () => {
      const findById = sinon.fake.returns(Promise.resolve(null));
      const mockQuery = () => ({ findById });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await getEmployeeByNumber(req, res);
      assert(findById.called);
      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        status: 'Not Found',
        message: 'Employee not found',
      });
    });

    it(" can't get Employee by Id", async () => {
      const findById = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ findById });
      sinon.replace(Employee, 'query', mockQuery);
      try {
        await getEmployeeByNumber(req, res);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });
});
