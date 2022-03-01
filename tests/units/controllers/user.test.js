import sinon from 'sinon';
import { assert, expect } from 'chai';
import User from '../../../src/models/User';
import controllers from '../../../src/controllers/users';
import dataFake from '../../fake-data/users';

const {
  fnRegister,
  fnLogin,
} = controllers;
const {
  user,
  dataLoginSuccessE,
} = dataFake;

let res;

describe('User\'s controllers', () => {
  describe('function Register', () => {
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

    it('Success register new user', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(user));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(User, 'query', fakeQuery);

      const req = {
        body: {
          username: 'customer103',
          password: 'Pass@1234',
          customerNumber: 103,
        },
      };

      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };


      const result = await fnRegister(req, res);
      assert(insertAndFetch.called);


      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        status: 'success',
        message: 'Register successfully!',
      });
    });

    it('Success register new user', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(user));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(User, 'query', fakeQuery);

      const req = {
        body: {
          username: 'employee',
          password: 'Pass@1234',
          employeeNumber: 1003,
        },
      };

      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };


      const result = await fnRegister(req, res);
      assert(insertAndFetch.called);


      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        status: 'success',
        message: 'Register successfully!',
      });
    });

    it('Register failed with status failure', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(User, 'query', fakeQuery);

      const req = {
        body: {
          username: 'customer103',
          password: 'Pass@1234',
          customerNumber: 103,
        },
      };

      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };

      const result = await fnRegister(req, res);
      assert(insertAndFetch.called);

      expect(result.status).to.eql(204);
      expect(result.data.message).to.eql('Registration failed');
    });

    it('Throw an error if failed register', async () => {
      const insertAndFetch = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(User, 'query', fakeQuery);

      const req = {
        body: {
          username: 'customer103',
          password: 'Pass@1234',
          customerNumber: 103,
        },
      };

      res.locals = {
        auth: {
          username: 'admin',
          employeeNumber: 1,
          role: 1,
        },
      };
      try {
        await fnRegister(req, res);
        expect(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('function Login()', () => {
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

    it('Success login, should return a message and token', async () => {
      const withGraphJoined = sinon.fake.returns(Promise.resolve(dataLoginSuccessE));
      const fakeQuery = () => ({
        findById: () => ({ withGraphJoined }),
      });
      sinon.replace(User, 'query', fakeQuery);

      const req = {
        body: {
          username: 'staff1056',
          password: 'Pass@1234',
        },
      };

      const result = await fnLogin(req, res);

      expect(result.status).to.eql(200);
    });

    it('Wrong username or password, should return a message', async () => {
      const withGraphJoined = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({
        findById: () => ({ withGraphJoined }),
      });
      sinon.replace(User, 'query', fakeQuery);

      const req = {
        body: {
          username: 'staff1056',
          password: 'Pass@asdasd',
        },
      };

      const result = await fnLogin(req, res);

      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        status: 'failure',
        message: 'Wrong username or password!',
      });
    });

    it('Failed to login, should throw an error', async () => {
      const withGraphJoined = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({
        findById: () => ({ withGraphJoined }),
      });
      sinon.replace(User, 'query', fakeQuery);

      const req = {
        body: {
          username: 'staff1056',
          password: 'Pass@asdasd',
        },
      };

      try {
        await fnLogin(req, res);
        assert(withGraphJoined.called);
      } catch (error) {
        expect(error.message).to.eql('Login Failed');
      }
    });
  });
});
