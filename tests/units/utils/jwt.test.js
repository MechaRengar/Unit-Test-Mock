import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import { assert, expect } from 'chai';
import functions from '../../../src/utils/jwt';
import dataFake from '../../fake-data/jwt';

const {
  signToken,
  verifyToken,
} = functions;

const {
  dataE,
  dataC,
  notToken,
} = dataFake;

const token = 'header.payload.signature';

describe('JWT', () => {
  describe('sign', () => {
    afterEach(() => sinon.restore());

    it('Success generate token', () => {
      const fakeData = sinon.fake.returns(token);
      sinon.replace(jwt, 'sign', fakeData);

      const result = signToken(dataE);

      expect(result).to.eql(token);
    });

    it('Token must have three parts', () => {
      const fakeData = sinon.fake.returns(token);
      sinon.replace(jwt, 'sign', fakeData);

      const tokenResult = signToken(dataC);
      const result = tokenResult.split('.');

      expect(result.length).to.eql(3);
    });

    it('If data input is correct but return a null token, should return a message', () => {
      const fakeData = sinon.fake.returns(null);
      sinon.replace(jwt, 'sign', fakeData);

      const result = signToken(dataC);

      expect(result).to.eql({
        status: 'failure',
        message: 'Sign token failed',
      });
    });

    it('If data input has one of the parameters is empty or null, function throw an error', async () => {
      const newErr = new Error('Internal Server Error');
      const fakeData = sinon.fake.returns(Promise.reject(newErr));
      sinon.replace(jwt, 'sign', fakeData);

      try {
        await signToken({
          username: 'usernametest',
          customerNumber: 100,
          role: 2,
        });
        assert(fakeData.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('verify', () => {
    afterEach(() => sinon.restore());

    it('Success verify with result return true', () => {
      const fakeData = sinon.fake.returns(true);
      sinon.replace(jwt, 'verify', fakeData);

      const result = verifyToken(token);
      expect(result).to.eql(true);
    });

    it('Result return might false', () => {
      const fakeData = sinon.fake.returns(false);
      sinon.replace(jwt, 'verify', fakeData);

      const result = verifyToken(token);
      expect(result).to.eql(false);
    });

    it('If the value of token input is empty or null, should return a message', () => {
      const fakeData = sinon.fake.returns(notToken);
      sinon.replace(jwt, 'verify', fakeData);

      const result = verifyToken(null);
      expect(result).to.eql(notToken);
    });

    it('Failed to verify token, should throw an error', () => {
      const fakeData = sinon.fake.throws('Internal Server Error');
      sinon.replace(jwt, 'verify', fakeData);

      const fn = () => verifyToken(token);

      expect(fn).to.throw('Internal Server Error');
    });
  });
});
