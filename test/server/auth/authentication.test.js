/* eslint-disable no-unused-expressions */
import supertest from 'supertest';
import chai from 'chai';

import testHelper from '../testHelper';
import app from '../../../tools/devServer';

const expect = chai.expect;
const request = supertest.agent(app);
const adminUser = testHelper.testUser1;
const regularUser = testHelper.testUser2;

describe('Authentication:', () => {
  let adminUserToken;
  let regularUserToken;

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
            user.id = res.body.user.id;
            done();
          });
      });
  });

  // Test endponts that require authentication
  describe('REQUESTS:', () => {
    // Authenticate a User
    describe('GET: (/api/documents) - ', () => {
      it('should not authenticate a user if no token is provided', (done) => {
        request.get('/api/documents')
          .end((error, response) => {
            expect(response.status).to.equal(401);
            expect(response.body.message).to
              .equal('Authentication required to access this route!');
            done();
          });
      });

      it('should not authentiacate a user if no token is provided', (done) => {
        request.get('/api/documents')
          .set({
            'x-access-token': 'this-is-an-invalid-token'
          })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            expect(response.body.message).to
              .equal('Authentication failed due to invalid token!');
            done();
          });
      });

      it('should authenticate a user if valid token is provided', (done) => {
        request.get('/api/documents')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    // Authenticate an admin - strictly admin route
    describe('GET: (/api/users) - ', () => {
      it('should not authenticate an admin if no token is provided', (done) => {
        request.get('/api/users')
          .end((error, response) => {
            expect(response.status).to.equal(401);
            expect(response.body.message).to
              .equal('Authentication required to access this route!');
            done();
          });
      });

      it('should not authentiacate an admin invalid is provided', (done) => {
        request.get('/api/users')
          .set({
            'x-access-token': 'this-is-an-invalid-token'
          })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            expect(response.body.message).to
              .equal('Authentication failed due to invalid token!');
            done();
          });
      });

      it('should not authentiacate an admin if user is not admin', (done) => {
        request.get('/api/users')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            expect(response.body.message).to
              .equal('Access Restricted; You are not an admin!');
            done();
          });
      });

      it('should authenticate an admin if user is admin', (done) => {
        request.post('/api/users/logout')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            done();
          });
      });
    });
  });
});