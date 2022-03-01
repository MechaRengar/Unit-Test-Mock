import { assert, expect } from 'chai';
import sinon from 'sinon';
import {
  create,
  deleted,
  getAll,
  getProductByCode,
  update,
} from '../../../src/controllers/products';
import Product from '../../../src/models/Product';
import { products, product, res, req } from '../../fake-data/fakeProduct';

describe('Products Controller', () => {
  beforeEach(() => {
    req;
    res;
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('getAll Products', () => {
    it('can get all products', async () => {
      const offset = sinon.fake.returns(Promise.resolve(products));
      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });

      sinon.replace(Product, 'query', mockQuery);
      const result = await getAll(req, res);
      assert(offset.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        status: 'success',
        page: 1,
        limit: 10,
        products,
      });
    });
    it('can get all products with no query', async () => {
      const offset = sinon.fake.returns(Promise.resolve(products));
      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });

      const req1 = {
        query: {
          page: '',
          limit: '',
        },
      };

      sinon.replace(Product, 'query', mockQuery);
      const result = await getAll(req1, res);
      assert(offset.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        status: 'success',
        page: 1,
        limit: 10,
        products,
      });
    });

    it('can get all products with no query', async () => {
      const offset = sinon.fake.returns(Promise.resolve(products));
      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });

      const req1 = {
        query: {
        },
      };

      sinon.replace(Product, 'query', mockQuery);
      const result = await getAll(req1, res);
      assert(offset.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        status: 'success',
        page: 1,
        limit: 10,
        products,
      });
    });

    it('Not found products, return a message', async () => {
      const offset = sinon.fake.returns(Promise.resolve([]));
      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });

      const req1 = {
        query: {
          page: '',
          limit: '',
        },
      };

      sinon.replace(Product, 'query', mockQuery);
      const result = await getAll(req1, res);
      assert(offset.called);
      expect(result.status).to.eql(404);
      expect(result.data).to.eql({
        status: 'Not Found',
        message: 'Product not found',
      });
    });

    it("can't get all products", async () => {
      const mockQuery = sinon.fake.throws('Internal Server Error');
      sinon.replace(Product, 'query', mockQuery);

      try {
        await getAll(req, res);
        assert(mockQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('create Product', () => {
    it('can create a product', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(product));
      const mockQuery = () => ({ insertAndFetch });
      sinon.replace(Product, 'query', mockQuery);
      const result = await create(req, res);
      assert(insertAndFetch.called);

      expect(result.status).to.eql(200);
      expect(result.data.product).to.eql(product);
    });
    it("can't create a product", async () => {
      const insertAndFetch = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ insertAndFetch });
      sinon.replace(Product, 'query', mockQuery);
      try {
        await create(req, res);
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('update Product', () => {
    it('can update a product', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(product));
      const mockQuery = () => ({ patchAndFetchById });
      sinon.replace(Product, 'query', mockQuery);
      const result = await update(req, res);

      assert(patchAndFetchById.called);

      expect(result.status).to.eql(200);
      expect(result.data.product).to.eql(product);
    });

    it('Not found product, should return message', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(null));
      const mockQuery = () => ({ patchAndFetchById });
      sinon.replace(Product, 'query', mockQuery);
      const result = await update(req, res);

      assert(patchAndFetchById.called);

      expect(result.status).to.eql(500);
      expect(result.data).to.eql({
        message: 'Update failed',
      });
    });

    it("can't update a product", async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ patchAndFetchById });
      sinon.replace(Product, 'query', mockQuery);
      try {
        await update(req, res);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('delete Product', () => {
    it('can delete Product', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve());
      const mockQuery = () => ({ deleteById });
      sinon.replace(Product, 'query', mockQuery);
      const result = await deleted(req, res);
      assert(deleteById.called);
      expect(result.status).to.eql(200);
      expect(result.data.message).to.eql('Deleted success');
    });
    it("can't delete Product", async () => {
      const deleteById = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ deleteById });
      sinon.replace(Product, 'query', mockQuery);
      try {
        await deleted(req, res);

        assert(deleteById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('get Product by Id', () => {
    it(' can get Product by Id', async () => {
      const findById = sinon.fake.returns(Promise.resolve(product));
      const mockQuery = () => ({ findById });
      sinon.replace(Product, 'query', mockQuery);
      const result = await getProductByCode(req, res);
      assert(findById.called);
      expect(result.status).to.eql(200);
      expect(result.data.product).to.eql(product);
    });
    it(" can't get Product by Id", async () => {
      const findById = sinon.fake.returns(Promise.reject());
      const mockQuery = () => ({ findById });
      sinon.replace(Product, 'query', mockQuery);
      try {
        await getProductByCode(req, res);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });
});
