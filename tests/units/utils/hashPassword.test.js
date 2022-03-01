import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import functions from '../../../src/utils/password';

const {
  hashPassword,
  checkPassword,
} = functions;

const password = 'Aajshdh@12312321';
const hashedPassword = 'jhafksdfiahdmasdnfbasdgfasdjouer8qu23r0wdsfjkfhoadskfh';

describe('bcryptjs', () => {
  describe('Test hash password', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Success hash password', () => {
      const fakeHash = sinon.fake.returns(hashedPassword);
      sinon.replace(bcrypt, 'hash', fakeHash);

      const result = hashPassword(password);

      expect(result).to.eql(hashedPassword);
    });

    it('If no parameters input, should return a message', () => {
      const fakeHash = sinon.fake.returns(null);

      sinon.replace(bcrypt, 'hash', fakeHash);

      const result = hashPassword();

      expect(result).to.eql({ message: 'Can not find password' });
    });

    it('If the hasshed password is empty, should return a message', () => {
      const fakeHash = sinon.fake.returns(null);

      sinon.replace(bcrypt, 'hash', fakeHash);

      const result = hashPassword(password);

      expect(result).to.eql({ message: 'Can not encrypt password' });
    });

    it('If the function could not encrypt password, should throw an error', () => {
      const fakeHash = sinon.fake.throws('Internal Server Error');

      sinon.replace(bcrypt, 'hash', fakeHash);

      const fn = () => hashPassword(password);

      expect(fn).to.throws('Internal Server Error');
    });
  });

  describe('Test compare passwords', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Success compare passwords with result is true', () => {
      const fakeHash = sinon.fake.returns(true);

      sinon.replace(bcrypt, 'compare', fakeHash);
      const result = checkPassword(password, hashedPassword);

      expect(result).to.eql(true);
    });

    it('Success compare passwords with result is false', () => {
      const fakeHash = sinon.fake.returns(false);

      sinon.replace(bcrypt, 'compare', fakeHash);
      const result = checkPassword(password, hashedPassword);

      expect(result).to.eql(false);
    });

    it('If the one of parameters is empty, should return a message', () => {
      const fakeHash = sinon.fake.returns(false);

      sinon.replace(bcrypt, 'compare', fakeHash);
      const result = checkPassword(null, hashedPassword);

      expect(result).to.eql({ message: 'Can not find input to compare' });
    });

    it('If the function could not compare passwords, should throw an error', () => {
      const fakeHash = sinon.fake.throws('Internal Server Error');

      sinon.replace(bcrypt, 'compare', fakeHash);
      const fn = () => checkPassword(password, hashedPassword);

      expect(fn).to.throw('Internal Server Error');
    });
  });
});
