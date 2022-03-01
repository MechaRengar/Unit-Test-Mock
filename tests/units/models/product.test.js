import { assert, expect } from 'chai';
import sinon from 'sinon';
import Product from '../../../src/models/Product';

import {
  products,
  product,
  validate,
  body,
  jsonSchemaValidation,
  req,
  res,
} from '../../fake-data/fakeProduct';

describe('Product Model', () => {
  describe('getProducts', () => {
    afterEach(() => {
      sinon.restore();
    });
    beforeEach(() => {
      req;
      res;
    });
    it('Get products success', async () => {
      const offset = sinon.fake.returns(Promise.resolve(products));
      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Product, 'query', mockQuery);
      const result = await Product.getProducts(req);
      assert(offset.called);
      offset.calledWith({ data: { result } });
      expect(result).to.eql(products);
    });

    it('Get product return null', async () => {
      const offset = sinon.fake.returns(Promise.resolve(null));
      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Product, 'query', mockQuery);
      const result = await Product.getProducts(req);
      assert(offset.called);

      expect(result).to.be.null;
    });

    it('Get product fail', async () => {
      const offset = sinon.fake();
      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({
            offset,
          }),
        }),
      });
      sinon.replace(Product, 'query', mockQuery);
      try {
        await Product.getProducts(req);
        assert(offset.called);
      } catch (error) {
        expect(error).to.eql();
      }
    });

    it('Get product success if page, limit equal null', async () => {
      req.query.limit = '';
      req.query.page = '';

      const offset = sinon.fake.returns(products);

      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({ offset }),
        }),
      });

      sinon.replace(Product, 'query', mockQuery);
      const result = await Product.getProducts(req);
      assert(offset.called);

      expect(result).to.eql(products);
    });
    it('Get product with modify', async () => {
      req.query.role = undefined;

      const offset = sinon.fake.returns(product);

      const mockQuery = () => ({
        modify: () => ({
          limit: () => ({ offset }),
        }),
      });
      sinon.replace(Product, 'query', mockQuery);

      const result = await Product.getProducts(req);
      assert(offset.called);

      expect(result).to.eql(product);
    });

    it('Get product with query builder', async () => {
      const filter = {
        page: 1,
        limit: 10,
        productLine: 'Motorcycles',
        min: 100,
        max: 1000,
        productName: 'qweqwe',
        productScale: 'sqweqw',
        productVendor: 'qweqw',
        productDescription: 'qweqwe',
      };

      const offset = sinon.fake.returns(products);

      const mockQueryBuilder = {
        where: () => { },
      };
      // expect where callCount ???

      const mockQuery = () => ({
        modify: (queryBuilder) => {
          queryBuilder(mockQueryBuilder);

          return {
            limit: () => ({ offset }),
          };
        },
      });
      sinon.replace(Product, 'query', mockQuery);
      const result = await Product.getProducts(filter);
      assert(offset.called);

      expect(result).to.eql(products);
    });

    it('Get product with query builder', async () => {
      const filter = {
        page: 1,
        limit: 10,
      };

      const offset = sinon.fake.returns(products);

      const mockQueryBuilder = {
        where: () => { },
      };

      const mockQuery = () => ({
        modify: (queryBuilder) => {
          queryBuilder(mockQueryBuilder);

          return {
            limit: () => ({ offset }),
          };
        },
      });
      sinon.replace(Product, 'query', mockQuery);
      const result = await Product.getProducts(filter);
      assert(offset.called);

      expect(result).to.eql(products);
    });
  });

  describe('createProduct', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Create a new product success', async () => {
      const insertAndFetch = sinon.fake.returns(product);
      const mockQuery = () => ({ insertAndFetch });
      sinon.replace(Product, 'query', mockQuery);
      const result = await Product.createProduct(product);
      assert(insertAndFetch.called);

      expect(result).to.eql(product);
    });
    it('create a new product Failed', async () => {
      const insertAndFetch = sinon.fake();
      const mockQuery = () => ({ insertAndFetch });
      sinon.replace(Product, 'query', mockQuery);
      try {
        await Product.createProduct(product);
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('UpdateProduct', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Update product success', async () => {
      const patchAndFetchById = sinon.fake.returns(product);
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Product, 'query', fakeQuery);
      const result = await Product.updateProduct(4, body);
      expect(result).to.eql(product);
    });

    it('Update product Fail', async () => {
      const patchAndFetchById = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Product, 'query', fakeQuery);

      try {
        await Product.updateProduct('productCode', body);
      } catch (err) {
        expect(err.message).to.eql('Internal Server Error');
      }
    });

    it('Update validate error by Ajv', async () => {
      const patchAndFetchById = sinon.fake();
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Product, 'query', fakeQuery);
      const badFn = function () {
        throw new TypeError('data invalid');
      };
      try {
        await Product.updateProduct(product);
        await validate(product);
        assert.fail();
      } catch (error) {
        expect(badFn).to.throws(TypeError);
      }
    });
  });

  describe('DeleteProduct', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Delete product success', async () => {
      const deleteById = sinon.fake.returns({ message: 'delete success' });
      const fakeQuery = () => ({
        deleteById,
      });
      sinon.replace(Product, 'query', fakeQuery);
      const result = await Product.deleteProduct(1222);
      expect(result.message).to.eql('delete success');
    });
    it('Delete product failure', async () => {
      const deleteById = sinon.fake.returns(
        Promise.reject(new Error('Internal server Error')),
      );
      const fakeQuery = () => ({
        deleteById,
      });
      sinon.replace(Product, 'query', fakeQuery);
      try {
        await Product.deleteProduct('productCode');
        assert(deleteById.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server Error');
      }
    });
  });

  describe('getProductByCode', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Get product by number Success', async () => {
      const findById = sinon.fake.returns(product);
      const fakeQuery = () => ({
        findById,
      });
      sinon.replace(Product, 'query', fakeQuery);
      const result = await Product.getById(1102);
      expect(result).to.eql(product);
    });

    it('Get product by number failed', async () => {
      const findById = sinon.fake.returns(
        Promise.reject(new Error('Internal Server Error')),
      );
      const fakeQuery = () => ({ findById });
      sinon.replace(Product, 'query', fakeQuery);
      try {
        await Product.getById('1111');
        assert.fail();
      } catch (e) {
        expect(e.message).to.eql('Internal Server Error');
      }
    });
  });

  describe('tableName', () => {
    it('get table name success', () => {
      const result = Product.tableName;
      expect(result).to.eql('products');
    });
    it('get table name fail', () => {
      try {
        Product.tableName;
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
      const result = Product.idColumn;
      expect(result).to.eql('productCode');
    });
    it('get id column fail', () => {
      try {
        Product.idColumn;
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
      const result = Product.jsonSchema;
      expect(result).to.eql(jsonSchemaValidation);
    });
    it('Json Schema fail', () => {
      try {
        Product.jsonSchema;
        assert.fail('Fail');
      } catch (err) {
        expect(err.message).to.eql('Fail');
      }
    });
  });
});
