/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import chai from 'chai';

import model from '../../../server/models';
import Helper from '../../../server/helpers/Helper';

const expect = chai.expect;

describe('Helpers:', () => {
  // Test Pagination Helper
  // Total count (query) for all documents = 6
  describe('Pagination:', () => {
    let query = {};
    let pagination = {};
    let expectedResult = {};

    it('Should return appropriate pageCount based on offset', () => {
      query = {
        limit: 10,
        offset: 0
      };

      expectedResult = {
        totalCount: 6,
        currentPage: 1,
        pageCount: 1,
        pageSize: 6
      };

      query.limit = 10;
      query.offset = 0;

      model.Document
        .findAndCountAll(query)
        .then((documents) => {
          pagination = Helper.pagination(
            query.limit, query.offset, documents.count
          );
          expect(pagination.totalCount).to.equal(expectedResult.totalCount);
          expect(pagination.currentPage).to.equal(expectedResult.currentPage);
          expect(pagination.pageCount).to.equal(expectedResult.pageCount);
          expect(pagination.pageSize).to.equal(expectedResult.pageSize);
        });
    });

    it('should return appropriate pageSize', () => {
      query = {
        limit: 3,
        offset: 4
      };

      expectedResult = {
        totalCount: 6,
        currentPage: 2,
        pageCount: 2,
        pageSize: 2
      };

      model.Document
        .findAndCountAll(query)
        .then((documents) => {
          pagination = Helper.pagination(
            query.limit, query.offset, documents.count
          );
          expect(pagination.totalCount).to.equal(expectedResult.totalCount);
          expect(pagination.currentPage).to.equal(expectedResult.currentPage);
          expect(pagination.pageCount).to.equal(expectedResult.pageCount);
          expect(pagination.pageSize).to.equal(expectedResult.pageSize);
        });
    });

    it('should return appropriate currentPage', () => {
      query = {
        limit: 2,
        offset: 2
      };

      expectedResult = {
        totalCount: 6,
        currentPage: 2,
        pageCount: 3,
        pageSize: 2
      };

      model.Document
        .findAndCountAll(query)
        .then((documents) => {
          pagination = Helper.pagination(
            query.limit, query.offset, documents.count
          );
          expect(pagination.totalCount).to.equal(expectedResult.totalCount);
          expect(pagination.currentPage).to.equal(expectedResult.currentPage);
          expect(pagination.pageCount).to.equal(expectedResult.pageCount);
          expect(pagination.pageSize).to.equal(expectedResult.pageSize);
        });
    });

    it('should return appropriate totalCount', () => {
      query = {
        limit: 3,
        offset: 5
      };

      expectedResult = {
        totalCount: 6,
        currentPage: 2,
        pageCount: 2,
        pageSize: 1
      };

      model.Document
        .findAndCountAll(query)
        .then((documents) => {
          pagination = Helper.pagination(
            query.limit, query.offset, documents.count
          );
          expect(pagination.totalCount).to.equal(expectedResult.totalCount);
          expect(pagination.currentPage).to.equal(expectedResult.currentPage);
          expect(pagination.pageCount).to.equal(expectedResult.pageCount);
          expect(pagination.pageSize).to.equal(expectedResult.pageSize);
        });
    });
  });
});
