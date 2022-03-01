import { assert, expect } from 'chai';
import { it } from 'mocha';
import sinon from 'sinon';
import ProductLine from '../../../src/models/ProductLine';
import dataFake from '../../fake-data/productLine';

const {
  tableName,
  idColumn,
  jsonSchema,
  relationMappings,
  getAllProductLine,
  createProductline,
  updateProductline,
  deleteProductline,
} = ProductLine;

const {
  schema,
  productLines,
  productLine,
} = dataFake;

describe('ProductLine', () => {
  describe('#model', () => {
    it('Success get table name', () => {
      expect(tableName).to.eql('productlines');
    });

    it('Success get value of id column', () => {
      expect(idColumn).to.eql('productLine');
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

  describe('Get all ProductLine ', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Get all ProductLine success', async () => {
      const fakeQuery = sinon.fake.returns(Promise.resolve(productLines));

      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await getAllProductLine();
      assert(fakeQuery.called);

      expect(result).to.eql(productLines);
    });

    it('Get all ProductLine fail', async () => {
      const fakeQuery = sinon.fake.returns(Promise.resolve(null));

      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await getAllProductLine();

      expect(result).to.eql({ status: 'failure', message: 'Get productLine failed' });
    });

    it('Can not get all ProductLine', async () => {
      const fakeQuery = sinon.fake.throws('Internal server error');
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await await getAllProductLine();
        assert(fakeQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Create ProductLine ', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Create ProductLine success', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(productLine));
      const fakeQuery = () => ({ insertAndFetch });

      sinon.replace(ProductLine, 'query', fakeQuery);
      const result = await createProductline({
        productLine: 'Ships',
        textDescription: 'Attention car enthusiasts: Make your wildest car ownership dreams come true. Whether you are looking for classic muscle cars, dream sports cars or movie-inspired miniatures, you will find great choices in this category. These replicas feature superb attention to detail and craftsmanship and offer features such as working steering system, opening forward compartment, opening rear trunk with removable spare wheel, 4-wheel independent spring suspension, and so on. The models range in size from 1:10 to 1:24 scale and include numerous limited edition and several out-of-production vehicles. All models include a certificate of authenticity from their manufacturers and come fully assembled and ready for display in the home or office.',
        htmlDescription: null,
        image: null,
      });

      expect(result).to.eql(productLine);
    });

    it('If create faild, should throw an error', async () => {
      const insertAndFetch = sinon.fake.throws('Internal Server Error');
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await createProductline({
          productLine: 'Ships',
          textDescription: 'Attention car enthusiasts: Make your wildest car ownership dreams come true. Whether you are looking for classic muscle cars, dream sports cars or movie-inspired miniatures, you will find great choices in this category. These replicas feature superb attention to detail and craftsmanship and offer features such as working steering system, opening forward compartment, opening rear trunk with removable spare wheel, 4-wheel independent spring suspension, and so on. The models range in size from 1:10 to 1:24 scale and include numerous limited edition and several out-of-production vehicles. All models include a certificate of authenticity from their manufacturers and come fully assembled and ready for display in the home or office.',
          htmlDescription: null,
          image: null,
        });
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });

    it('If create success with result is null, should return a message', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await createProductline({
          productLine: 'Ships',
          textDescription: 'Attention car enthusiasts: Make your wildest car ownership dreams come true. Whether you are looking for classic muscle cars, dream sports cars or movie-inspired miniatures, you will find great choices in this category. These replicas feature superb attention to detail and craftsmanship and offer features such as working steering system, opening forward compartment, opening rear trunk with removable spare wheel, 4-wheel independent spring suspension, and so on. The models range in size from 1:10 to 1:24 scale and include numerous limited edition and several out-of-production vehicles. All models include a certificate of authenticity from their manufacturers and come fully assembled and ready for display in the home or office.',
          htmlDescription: null,
          image: null,
        });
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.message).to.eql({ message: 'Create ProductLine Failed' });
      }
    });
  });

  describe('Update ProductLine', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Update ProductLine success', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(productLine));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(ProductLine, 'query', fakeQuery);
      const id = 'Ships';
      const data = {
        image: 'Update',
      };

      const result = await updateProductline(id, data);
      assert(patchAndFetchById.called);

      expect(result).to.eql(productLine);
    });

    it('If the id ProductLine is null, should return a message', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ patchAndFetchById });

      sinon.replace(ProductLine, 'query', fakeQuery);
      const id = 'Ships';
      const data = {
        image: 'Update',
      };

      try {
        await updateProductline(id, data);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.message).to.eql({ message: 'Update failed' });
      }
    });

    it('Can not update Productline', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.reject('Internal server error'));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(ProductLine, 'query', fakeQuery);

      const id = 'Ships';
      const data = {
        image: 'Update',
      };
      try {
        await updateProductline(id, data);
        assert(fakeQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Delete productLine', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Delete productLine success', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve(1));
      const fakeQuery = () => ({ deleteById });

      sinon.replace(ProductLine, 'query', fakeQuery);

      const result = await deleteProductline('Ships');
      assert(deleteById.called);

      expect(result).to.eql({
        status: 'success',
      });
    });

    it('If the productLine is zero, should return a message', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve(0));
      const fakeQuery = () => ({ deleteById });

      sinon.replace(ProductLine, 'query', fakeQuery);

      const result = await deleteProductline('Ships');

      expect(result).to.eql({
        message: 'Delete failed',
      });
    });

    it("can't delete productLine", async () => {
      const deleteById = sinon.fake.returns(Promise.reject());
      const fakeQuery = () => ({ deleteById });
      sinon.replace(ProductLine, 'query', fakeQuery);

      try {
        await deleteProductline();

        assert(deleteById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });
});
