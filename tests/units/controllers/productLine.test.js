import sinon from 'sinon';
import { assert, expect } from 'chai';
import ProductLine from '../../../src/models/ProductLine';
import controllers from '../../../src/controllers/productlines';
import dataFake from '../../fake-data/productLine';

const { fnGetAll, fnCreate, fnUpdate, fnDelete } = controllers;

const { productLines, productLine } = dataFake;

let req;
let res;

describe('ProductLine\'s controllers', () => {
  before(() => {
    (res = {
      status: code => ({
        json: data => ({
          status: code,
          data,
        }),
      }),
    });
    (req = {
      params: 'Ships',
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAll productLine', () => {
    it('Get all productLine success', async () => {
      const fakeQuery = sinon.fake.returns(Promise.resolve(productLines));
      sinon.replace(ProductLine, 'query', fakeQuery);

      const result = await fnGetAll(req, res);
      assert(fakeQuery.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'success',
        total: productLines.length,
        productLines,
      });
    });

    it('Get all productLine fail', async () => {
      const fakeQuery = sinon.fake.throws('Internal Server Error');
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await fnGetAll(req, res);
        assert(fakeQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });

    it("can't get all productLine", async () => {
      const fakeQuery = sinon.fake.returns(Promise.reject('Internal server error'));
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await fnGetAll(req, res);
        assert(fakeQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Create productLine', () => {
    it('Create productLine success', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(productLine));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await fnCreate(req, res);


      assert(insertAndFetch.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({ message: 'success', productLine });
    });

    it("can't create a productLine", async () => {
      const insertAndFetch = sinon.fake.returns(
        Promise.reject({ message: 'Internal server error', status: 500 }),
      );
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(ProductLine, 'query', fakeQuery);
      try {
        await fnCreate(req, res);
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Update productLine', () => {
    it('Update office success', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(productLine));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await fnUpdate(req, res);

      assert(patchAndFetchById.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'success',
        productLine,
      });
    });

    it('Update office failed', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await fnUpdate(req, res);

      assert(patchAndFetchById.called);

      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        status: 'failure', message: 'Update productLine failed',
      });
    });

    it("can't update a productLine", async () => {
      const patchAndFetchById = sinon.fake.returns(
        Promise.reject({ message: 'Internal server error', status: 500 }),
      );
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await fnUpdate(req, res);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Delete productLine', () => {
    it('Delete productLine success', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve(1));
      const fakeQuery = () => ({ deleteById });
      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await fnDelete(req, res);

      assert(deleteById.called);
      expect(result.status).to.eql(200);
      expect(result.data.message).to.eql('Deleted success');
    });

    it('Delete productLine success', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve(0));
      const fakeQuery = () => ({ deleteById });
      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await fnDelete(req, res);

      assert(deleteById.called);
      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        status: 'Not Found', message: 'Could not delete product line',
      });
    });

    it("can't delete productLine", async () => {
      const deleteById = sinon.fake.returns(Promise.reject());
      const fakeQuery = () => ({ deleteById });
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await fnDelete(req, res);

        assert(deleteById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });
});
