import { assert, expect } from 'chai';
import sinon from 'sinon';
import Employee from '../../../src/models/Employee';
import { employee, req, res, next } from '../../fake-data/fakeEmployee';
import {
  checkGetManager,
  checkEmployeeExists,
  checkReportsTo,
} from '../../../src/middlewares/checkData/employee';

describe('employeeMiddlewareTest', () => {
  beforeEach(() => {
    req;
    res;
  });
  afterEach(() => {
    sinon.restore();
  });
  it('role Manager allow next', async () => {
    const findById = sinon.fake.returns(employee);
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const result = await checkGetManager(req, res, next);
    assert(findById.called);

    expect(result).to.eql('allow next');
  });

  it('role Admin allow next', async () => {
    res.locals.auth.role = 1;
    const findById = sinon.fake.returns(employee);
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const result = await checkGetManager(req, res, next);
    assert(findById.called);

    expect(result).to.eql('allow next');
  });
  it('role Manager unauthorized', async () => {
    const findById = sinon.fake.returns(employee);
    res.locals.auth.role = 2;
    res.locals.auth.officeCode = 'viet';
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const result = await checkGetManager(req, res, next);
    assert(findById.called);

    expect(result.status).to.eql(403);
    expect(result.data).to.eql(
      { message: 'Forbidden' },
    );
  });
  it('role does not manager unauthorized', async () => {
    res.locals.auth.role = 3;
    const findById = sinon.fake.returns(Promise.resolve(employee));
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const result = await checkGetManager(req, res, next);
    assert(findById.called);

    expect(result.status).to.eql(401);
    expect(result.data.message).to.eql('Unauthorized');
  });
  it('Internal Server Error', async () => {
    const findById = sinon.fake.returns(Promise.reject());
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    try {
      await checkGetManager(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql('Internal Server Error');
    }
  });
});

describe('checkEmployeeExists', () => {
  beforeEach(() => {
    req;
    res;
  });
  afterEach(() => {
    sinon.restore();
  });
  it('Employee does not exist allow next', async () => {
    const findById = sinon.fake.returns(Promise.resolve());
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const result = await checkEmployeeExists(req, res, next);
    assert(findById.called);

    expect(result).to.eql('allow next');
  });

  it('Employee does exists', async () => {
    const findById = sinon.fake.returns(Promise.resolve(employee));
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const result = await checkEmployeeExists(req, res, next);
    assert(findById.called);

    expect(result.status).to.eql(400);
    expect(result.data).to.eql({ message: 'Employee does exist' });
  });
  it('check employee exists success', async () => {
    try {
      await checkEmployeeExists(req, res, next);
    } catch (error) {
      expect(error.message).to.eql();
    }
  });
});

describe('checkReportsTo', () => {
  beforeEach(() => {
    req;
    res;
  });
  afterEach(() => {
    sinon.restore();
  });
  it('reportsTo exist', async () => {
    const findById = sinon.fake.returns(Promise.resolve(employee));
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const results = await checkReportsTo(req, res, next);
    assert(findById.called);

    expect(results).to.eql('allow next');
  });
  it('reportsTo does not exist', async () => {
    const findById = sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    const results = await checkReportsTo(req, res, next);
    assert(findById.called);

    expect(results.status).to.eql(400);
    expect(results.data).to.eql({ message: 'ReportsTo does not exist' });
  });
  it('reportsTo does not exist', async () => {
    const findById = sinon.fake.returns(Promise.reject());
    const mockQuery = () => ({ findById });
    sinon.replace(Employee, 'query', mockQuery);
    try {
      await checkReportsTo(req, res, next);
      assert(findById.called);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error).to.eql({ message: 'Internal Server Error' });
    }
  });
});
