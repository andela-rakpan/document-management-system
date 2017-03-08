/* eslint-disable no-unused-expressions */

import supertest from 'supertest';
import chai from 'chai';

import TestHelper from '../helpers/TestHelper';
import app from '../../../lib/devServer';

const expect = chai.expect;
const request = supertest.agent(app);

const adminUser = TestHelper.testUser1;
const regularUser = TestHelper.testUser2;

describe('Search API:', () => {
  let adminUserToken;
  let regularUserToken;
  const user = {};

  // Login users to access this endpoint
  before((done) => {
    request.post('/api/users/login')
      .send(adminUser)
      .end((error, response) => {
        adminUserToken = response.body.token;

        request.post('/api/users/login')
          .send(regularUser)
          .end((err, res) => {
            regularUserToken = res.body.token;
            user.id = res.body.userId;
            done();
          });
      });
  });

  // Test documents search http requests
  describe('Search Documents REQUESTS:', () => {
    // GET requests - Search document(s) for specified term(s)
    describe('GET: (/api/search/documents?term) - ', () => {
      const term = 'the';
      it('should not return document(s) if search term is empty', (done) => {
        request.get('/api/search/documents?term=')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to
              .equal('Invalid Search Parameter!');
            done();
          });
      });

      it('should return all matching document(s) if user is admin', (done) => {
        request.get(`/api/search/documents?term=${term}`)
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body.documents)).to.be.true;
            expect(response.body.documents.length).to.be.greaterThan(0);
            done();
          });
      });

      it('should return matching documents if user is not admin',
      (done) => {
        request.get(`/api/search/documents?term=${term}`)
          .set({
            Authorization: regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body.documents)).to.be.true;
            expect(response.body.documents.length).to.be.greaterThan(0);
            done();
          });
      });
    });
  });
});
