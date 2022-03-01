import sinon from 'sinon';
import { assert, expect } from 'chai';
import Office from '../../../src/models/Office';
import controllers from '../../../src/controllers/offices';
import dataFake from '../../fake-data/office';

const { fnGetAll, fnGetOffice, fnCreate, fnUpdate, fnDelete } = controllers;

const { Offices, office } = dataFake;

let req;
let res;

describe('Office\'s controllers', () => {
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
      params: '1',
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAll office', () => {
    it('Get all office success', async () => {
      const fakeQuery = sinon.fake.returns(Promise.resolve(Offices));
      sinon.replace(Office, 'query', fakeQuery);

      const result = await fnGetAll(req, res);
      assert(fakeQuery.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'success',
        total: Offices.length,
        Offices,
      });
    });

    it('Get all office fail', async () => {
      const fakeQuery = sinon.fake.returns(Promise.resolve(null));
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await fnGetAll(req, res);
        assert(fakeQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });

    it("can't get all office", async () => {
      const fakeQuery = sinon.fake.returns(Promise.reject('Internal server error'));
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await fnGetAll(req, res);
        assert(fakeQuery.called);
      } catch (error) {
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('get office by office code', () => {
    it('Get office by office code success', async () => {
      const findById = sinon.fake.returns(Promise.resolve(office));
      const fakeQuery = () => ({ findById });
      sinon.replace(Office, 'query', fakeQuery);

      const result = await fnGetOffice(req, res);

      assert(findById.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({ message: 'success', office });
    });

    it('Get office by office code fail', async () => {
      const findById = sinon.fake.returns(Promise.resolve(null));
      const fakeQuery = () => ({ findById });
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await fnGetOffice(req, res);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });

    it('Can not get office by office code', async () => {
      const findById = sinon.fake.returns(Promise.reject('Internal server error'));
      const fakeQuery = () => ({ findById });
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await fnGetOffice(req, res);
        assert(findById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Create Office', () => {
    it('Create office success', async () => {
      const insertAndFetch = sinon.fake.returns(Promise.resolve(office));
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Office, 'query', fakeQuery);
      const result = await fnCreate(req, res);


      assert(insertAndFetch.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({ message: 'success', office });
    });

    it("can't create a office", async () => {
      const insertAndFetch = sinon.fake.returns(
        Promise.reject({ message: 'Internal server error', status: 500 }),
      );
      const fakeQuery = () => ({ insertAndFetch });
      sinon.replace(Office, 'query', fakeQuery);
      try {
        await fnCreate(req, res);
        assert(insertAndFetch.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Update Office', () => {
    it('Update office success', async () => {
      const patchAndFetchById = sinon.fake.returns(Promise.resolve(office));
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Office, 'query', fakeQuery);
      const result = await fnUpdate(req, res);

      assert(patchAndFetchById.called);
      expect(result.status).to.eql(200);
      expect(result.data).to.eql({
        message: 'success',
        office,
      });
    });

    it("can't update a office", async () => {
      const patchAndFetchById = sinon.fake.returns(
        Promise.reject({ message: 'Internal server error', status: 500 }),
      );
      const fakeQuery = () => ({ patchAndFetchById });
      sinon.replace(Office, 'query', fakeQuery);

      try {
        await fnUpdate(req, res);
        assert(patchAndFetchById.called);
      } catch (error) {
        expect(error.statusCode).to.eql(500);
        expect(error.message).to.eql('Internal server error');
      }
    });
  });

  describe('Delete office', () => {
    it('Delete office success', async () => {
      const deleteById = sinon.fake.returns(Promise.resolve());
      const fakeQuery = () => ({ deleteById });
      sinon.replace(Office, 'query', fakeQuery);
      const result = await fnDelete(req, res);

      assert(deleteById.called);
      expect(result.status).to.eql(200);
      expect(result.data.message).to.eql('Deleted success');
    });

    it("can't delete Office", async () => {
      const deleteById = sinon.fake.returns(Promise.reject());
      const fakeQuery = () => ({ deleteById });
      sinon.replace(Office, 'query', fakeQuery);

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
