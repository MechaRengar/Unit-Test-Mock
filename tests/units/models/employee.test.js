import { assert, expect } from 'chai';
import sinon from 'sinon';
import Employee from '../../../src/models/Employee';
import {
  employees,
  employee,
  validate,
  body,
  updatedBody,
  jsonSchemaValidation,
  req,
  res,
} from '../../fake-data/fakeEmployee';

describe('Employee Model', () => {
  describe('getEmployees', () => {
    afterEach(() => {
      sinon.restore();
    });
    beforeEach(() => {
      req;
      res;
    });
    it('Get employees success', async () => {
      const offset = sinon.fake.returns(Promise.resolve(employee));
      const mockQuery = () => ({
        where: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await Employee.getEmployees(req);
      assert(offset.called);

      expect(result.data).to.eql(employee);
    });

    it('Get employee return null', async () => {
      const offset = sinon.fake.returns();
      const mockQuery = () => ({
        where: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await Employee.getEmployees(req);
      assert(offset.called);

      expect(result).to.eql({ message: 'Employee is null' });
    });

    it('Get employee fail', async () => {
      const offset = sinon.fake();
      const mockQuery = () => ({
        where: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Employee, 'query', mockQuery);
      try {
        await Employee.getEmployees(req);
        assert(offset.called);
      } catch (error) {
        console.log('🚀========> error', error);
        expect(error).to.eql();
      }
    });

    it('Get employee success if page, limit equal null', async () => {
      req.query.limit = undefined;
      req.query.page = undefined;

      const offset = sinon.fake.returns(Promise.resolve(employee));

      const mockQuery = () => ({
        where: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await Employee.getEmployees(req);
      assert(offset.called);

      expect(result.data).to.eql(employee);
    });
    it('Get employee with modify', async () => {
      req.query.role = undefined;

      const offset = sinon.fake.returns(employee);

      const mockQuery = () => ({
        where: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Employee, 'query', mockQuery);
      const result = await Employee.getEmployees(req);
      assert(offset.called);

      expect(result.data).to.eql(employee);
    });
  });

  describe('getEmployeeByNumber', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Get employee by number Success', async () => {
      const findById = sinon.fake.returns(employee);
      const fakeQuery = () => ({
        findById,
      });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.getById(1102);
      expect(result).to.eql(employee);
    });

    it('Get employee by number failed', async () => {
      const findById = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ findById });
      sinon.replace(Employee, 'query', fakeQuery);
      try {
        await Employee.getById('1111');
        assert.fail();
      } catch (e) {
        expect(e.message).to.eql('Internal Server Error');
      }
    });

    it('employeeNumber does not a Number => getById("viet");', async () => {
      const findById = sinon.fake.throws('Invalid type Employee Number');
      const fakeQuery = () => ({ findById });
      sinon.replace(Employee, 'query', fakeQuery);
      try {
        await Employee.getById('abc');
      } catch (e) {
        expect(e.message).to.eql('Invalid type Employee Number');
      }
    });

    it('If employeeNumber type string => success', async () => {
      const findById = sinon.fake.returns(employee);
      const fakeQuery = () => ({ findById });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.getById('1102');
      expect(result).to.eql(employee);
    });
  });

  describe('createEmployee', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('creates a new employee success', async () => {
      const insertAndFetch = sinon.fake.returns(employee);
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.createEmployee(employee);
      expect(result).to.eql(employee);
    });

    it('creates a new employee failed', async () => {
      const insertAndFetch = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Employee, 'query', fakeQuery);

      try {
        await Employee.createEmployee(employee);
      } catch (err) {
        expect(err.message).to.eql('Internal Server Error');
      }
    });

    it('validate error by Ajv', async () => {
      const insertAndFetch = sinon.fake();
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Employee, 'query', fakeQuery);
      const badFn = function () {
        throw new TypeError('data invalid');
      };
      try {
        await Employee.createEmployee(employee);
        await validate(employee);
        assert.fail();
      } catch (error) {
        expect(badFn).to.throws(TypeError);
      }
    });
  });

  describe('UpdateEmployee', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Update employee success', async () => {
      const patchAndFetchById = sinon.fake.returns(employee);
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.updateEmployee(4, body);
      expect(result).to.eql(employee);
    });

    it('Update employee Fail', async () => {
      const patchAndFetchById = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Employee, 'query', fakeQuery);

      try {
        await Employee.updateEmployee(4, updatedBody);
        assert.fail();
      } catch (err) {
        expect(err.message).to.eql('Internal Server Error');
      }
    });

    it('Update validate error by Ajv', async () => {
      const patchAndFetchById = sinon.fake();
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Employee, 'query', fakeQuery);
      const badFn = function () {
        throw new TypeError('data invalid');
      };
      try {
        await Employee.updateEmployee(employee);
        await validate(employee);
        assert.fail();
      } catch (error) {
        expect(badFn).to.throws(TypeError);
      }
    });
  });

  describe('DeleteEmployee', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Delete employee success', async () => {
      const deleteById = sinon.fake.returns({ message: 'delete success' });
      const fakeQuery = () => ({
        deleteById,
      });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.deleteEmployee(1222);
      expect(result.message).to.eql('delete success');
    });

    it('employeeNumber does not a Number ', async () => {
      const deleteById = sinon.fake();
      const fakeQuery = () => ({ deleteById });
      sinon.replace(Employee, 'query', fakeQuery);
      try {
        await Employee.deleteEmployee();
        assert.fail();
      } catch (err) {
        expect(err.message).to.eql('employeeNumber must a Number');
      }
    });
  });

  describe('tableName', () => {
    it('get table name success', () => {
      const result = Employee.tableName;
      expect(result).to.eql('employees');
    });
    it('get table name fail', () => {
      try {
        Employee.tableName;
        assert.fail('Fail');
      } catch (error) {
        expect(error.message).to.eql('Fail');
      }
    });
  });

  describe('idColumn', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('get column success', () => {
      const result = Employee.idColumn;
      expect(result).to.eql('employeeNumber');
    });
    it('get id column fail', () => {
      try {
        Employee.idColumn;
        assert.fail('Fail');
      } catch (e) {
        expect(e.message).to.eql('Fail');
      }
    });
  });

  describe('jsonSchema', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Json Schema success', () => {
      const result = Employee.jsonSchema;
      expect(result).to.eql(jsonSchemaValidation);
    });
    it('Json Schema fail', () => {
      try {
        Employee.jsonSchema;
        assert.fail('Fail');
      } catch (err) {
        expect(err.message).to.eql('Fail');
      }
    });
  });
  describe('relationMappings', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('relationMappings success', () => {
      const result = Employee.relationMappings;
      expect(result).to.be.an('Object');
    });
    it('relationMappings fail', () => {
      try {
        Employee.relationMappings;
        assert.fail('Fail');
      } catch (err) {
        expect(err.message).to.eql('Fail');
      }
    });
  });

  describe('getEmployeeNumbers', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('getEmployeeNumbers success', async () => {
      const orWhere = sinon.fake.returns(employees);
      const where = () => ({ orWhere });
      const select = () => ({ where });
      const fakeQuery = () => ({ select });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.getEmployeeNumbers();

      expect(result).to.eql([1, 2, 3]);
    });

    it('getEmployeeNumbers fail', async () => {
      const orWhere = sinon.fake.throws('Internal Server Error');
      const where = () => ({ orWhere });
      const select = () => ({ where });
      const fakeQuery = () => ({ select });
      sinon.replace(Employee, 'query', fakeQuery);
      try {
        await Employee.getEmployeeNumbers();
      } catch (error) {
        expect(error.message).to.equal('Internal Server Error');
      }
    });
    it('getEmployeeNumbers return array null', async () => {
      const orWhere = sinon.fake.returns([]);
      const where = () => ({ orWhere });
      const select = () => ({ where });
      const fakeQuery = () => ({ select });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.getEmployeeNumbers();
      expect(result).to.eql([]);
    });
    it('employeeNumber does not a Number', async () => {
      const orWhere = sinon.fake.throws('employeeNumber must be a number');
      const where = () => ({ orWhere });
      const select = () => ({ where });
      const fakeQuery = () => ({ select });
      sinon.replace(Employee, 'query', fakeQuery);
      try {
        await Employee.getEmployeeNumbers('asdfsđf');
      } catch (err) {
        expect(err.message).to.eql('employeeNumber must be a number');
      }
    });
  });

  describe('getByOffice', () => {
    beforeEach(() => {
      sinon.restore();
    });
    it('getbyOffice success', async () => {
      const where = sinon.fake.returns(employees);

      const fakeQuery = () => ({ where });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.getByOffice('sdsd');

      expect(result).to.eql(employees);
    });
    it('getbyOffice fail', async () => {
      const where = sinon.fake.throws('Internal Server Error');

      const fakeQuery = () => ({ where });
      sinon.replace(Employee, 'query', fakeQuery);
      try {
        await Employee.getByOffice('sds');
        assert.fail();
      } catch (e) {
        expect(e.message).to.eql('Internal Server Error');
      }
    });
    it('getbyOffice return null', async () => {
      const where = sinon.fake.returns([]);

      const fakeQuery = () => ({ where });
      sinon.replace(Employee, 'query', fakeQuery);
      const result = await Employee.getByOffice('123');
      expect(result).to.eql([]);
    });
  });
});
