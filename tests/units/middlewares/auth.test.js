import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import auth from '../../../src/middlewares/auth';


let req;
let res;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZU51bWJlciI6MTAwMiwicm9sZSI6MSwiaWF0IjoxNjQwMDA4MDg2LCJleHAiOjE2NDAwOTQ0ODZ9.j4fyOW4CQf6LSy87ABh6gpopFXLeY-s54by2kcCJqTw';

describe('Test Auth Middlewares', () => {
  const authMiddleware = auth([1, 2]);

  afterEach(() => {
    sinon.restore();
  });
  it('Success verify token and the next function should be called', () => {
    const fakeData = sinon.fake.returns({
      role: 2,
    });
    sinon.replace(jwt, 'verify', fakeData);

    req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'TEST',
    };

    res = {
      locals: {},
    };

    const next = sinon.fake.returns(function () { });

    expect(authMiddleware(req, res, next)).to.be.a('function');
    expect(next.called).to.eql(true);
    expect(res.locals).to.has.property('auth');
  });

  it('Throw an error if the middleware has no req headers', () => {
    const fakeData = sinon.fake.throws('Unauthorized');
    sinon.replace(jwt, 'verify', fakeData);
    req = {
      headers: {
        authorization: null,
      },
      method: 'TEST',
    };

    const fn = () => {
      authMiddleware(req, res);
    };

    expect(fn).to.throw('Unauthorized');
  });

  it('JWT verify token and return data is empty of null, should throw an error', () => {
    const fakeData = sinon.fake.returns(null);
    sinon.replace(jwt, 'verify', fakeData);

    req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'TEST',
    };

    const fn = () => {
      authMiddleware(req, res);
    };

    expect(fn).to.throw('Can not find token');
  });

  it('JWT verify token and return data but value of role is null, should throw an error', () => {
    const fakeData = sinon.fake.returns({
      role: null,
    });
    sinon.replace(jwt, 'verify', fakeData);

    req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'TEST',
    };

    const fn = () => {
      authMiddleware(req, res);
    };

    expect(fn).to.throw('Unauthorized');
  });

  it('JWT verify token and return data but forbidden, should throw an error', () => {
    const fakeData = sinon.fake.returns({
      role: 3,
      username: 'staff',
    });
    sinon.replace(jwt, 'verify', fakeData);

    req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'TEST',
      originalUrl: '/test',
    };

    const fn = () => {
      authMiddleware(req, res);
    };

    expect(fn).to.throw('Forbidden');
  });
});
