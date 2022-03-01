import { assert, expect } from 'chai';
import { it } from 'mocha';
import sinon from 'sinon';
import User from '../../../src/models/User';
import dataFake from '../../fake-data/users';

const {
  tableName,
  idColumn,
  jsonSchema,
  relationMappings,
  register,
  login,
  getById,
} = User;

const {
  schema,
  userC,
  userE,
  dataLoginE,
  dataLoginC,
  dataLoginSuccessE,
  dataLoginFailedE,
  dataLoginSuccessC,
  validate,
  user,
} = dataFake;

describe('User', () => {
  describe('#model', () => {
    it('Success get table name', () => {
      expect(tableName).to.eql('users');
    });

    it('Success get value of id column', () => {
      expect(idColumn).to.eql('username');
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

  describe('register', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Success register', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve({
        status: 'success',
        message: 'Register successfully!',
      }));

      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(User, 'query', fakeQuery);

      const result = await register(userE);

      expect(result).to.eql({
        status: 'success',
        message: 'Register successfully!',
      });
    });

    it('Register success with value of new user is empty or null, should return a message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(User, 'query', fakeQuery);

      const result = await register(userC);

      expect(result).to.be.null;
    });
  });

  describe('login', () => {
    afterEach(() => sinon.restore());

    it('Success to login with employee\'s account', async () => {
      const withGraphJoined = sinon.fake.returns(Promise.resolve(dataLoginSuccessE));
      const fakeQuery = () => ({
        findById: () => ({
          withGraphJoined,
        }),
      });

      sinon.replace(User, 'query', fakeQuery);
      const result = await login(dataLoginE);
      const valid = validate(result);

      expect(valid).to.eql(true);
    });

    it('Success to login with customer\'s account', async () => {
      const withGraphJoined = sinon.fake.returns(Promise.resolve(dataLoginSuccessC));
      const fakeQuery = () => ({
        findById: () => ({
          withGraphJoined,
        }),
      });

      sinon.replace(User, 'query', fakeQuery);
      const result = await login(dataLoginC);
      const valid = validate(result);

      expect(valid).to.eql(true);
    });

    it('Wrong username, should return a message', async () => {
      const withGraphJoined = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({
        findById: () => ({
          withGraphJoined,
        }),
      });

      sinon.replace(User, 'query', fakeQuery);
      const result = await login(dataLoginC);

      expect(result).to.eql({
        status: 'failure',
        message: 'Wrong username or password!',
      });
    });

    it('Wrong password, should return a message', async () => {
      const withGraphJoined = sinon.fake.returns(Promise.resolve(dataLoginFailedE));
      const fakeQuery = () => ({
        findById: () => ({
          withGraphJoined,
        }),
      });

      sinon.replace(User, 'query', fakeQuery);
      const result = await login(dataLoginE);

      expect(result).to.eql({
        status: 'failure',
        message: 'Wrong username or password!',
      });
    });

    it('Login failed, should throw an error', async () => {
      const withGraphJoined = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({
        findById: () => ({
          withGraphJoined,
        }),
      });
      sinon.replace(User, 'query', fakeQuery);

      try {
        await login(dataLoginC);
        assert(withGraphJoined.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('getById', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Success get user by id field', async () => {
      const findById = sinon.fake.returns(Promise.resolve(user));
      const fakeQuery = () => ({ findById });
      sinon.replace(User, 'query', fakeQuery);

      const result = await getById('customer103');

      expect(result).to.eql({
        username: 'customer103',
        password: '$2a$10$06YZ2bT7Afm5P0Q94WlBX.Xh9ns8dJ1GdQ6sdY0Kdyr56M0ru4XrS',
        employeeNumber: null,
        customerNumber: 103,
        isActive: 1,
      });
    });

    it('If the user is not found, should return a message', async () => {
      const findById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ findById });
      sinon.replace(User, 'query', fakeQuery);

      const result = await getById('customer103');

      expect(result).to.eql({
        status: 'failure',
        message: 'Could not find user',
      });
    });

    it('Failed to find a user, should throw an error', async () => {
      const findById = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ findById });
      sinon.replace(User, 'query', fakeQuery);

      try {
        await getById('customer');
        assert(findById.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });
});
