/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import supertest from 'supertest';
import chai from 'chai';
import httpMocks from 'node-mocks-http';
import events from 'events';
import spies from 'chai-spies';

import TestHelper from '../helpers/TestHelper';
import app from '../../../lib/devServer';
import Authentication from '../../../server/middlewares/Authentication';

const expect = chai.expect;
const request = supertest.agent(app);
const adminUser = TestHelper.testUser1;
const regularUser = TestHelper.testUser2;

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
            Authorization: 'this-is-an-invalid-token'
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
            Authorization: regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body.documents)).to.be.true;
            expect(response.body.documents.length).to.equal(4);
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
            Authorization: 'this-is-an-invalid-token'
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
            Authorization: regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            expect(response.body.message).to
              .equal('Access Restricted; You are not an admin!');
            done();
          });
      });

      it('should authenticate an admin if user is admin', (done) => {
        request.get('/api/users')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body.users)).to.be.true;
            expect(response.body.users.length).to.equal(3);
            done();
          });
      });
    });
  });

  // Test middleware functions
  describe('Middleware Functions:', () => {
    let req, res;

    chai.use(spies);

    const buildResponse = () =>
      httpMocks.createResponse({ eventEmitter: events.EventEmitter });

    // checkDocumentOwner middleware
    describe('checkDocumentOwner:', () => {
      it('should not continue if id is invalid',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/invalidId',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId },
          params: { id: 'invalidId' }
        });

        res.on('end', () => {
          expect(res._getData().message).to
            .equal('An error occured. Ensure your parameters are valid!');
          done();
        });

        Authentication.checkDocumentOwner(req, res);
      });

      it('should not continue if document is not found',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/12345',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId },
          params: { id: 12345 }
        });

        res.on('end', () => {
          expect(res._getData().message).to.equal('Document Not Found');
          done();
        });

        Authentication.checkDocumentOwner(req, res);
      });

      it('should not continue if document is private and user is not owner',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/2',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId },
          params: { id: 2 }
        });

        res.on('end', () => {
          expect(res._getData().message).to
            .equal('You are not authorized to access this document');
          done();
        });
        Authentication.checkDocumentOwner(req, res);
      });

      it('should continue if document is public and user is not owner',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/3',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId },
          params: { id: 3 }
        });
        const next = () => 'called';

        const spy = chai.spy(next);
        expect(spy()).to.equal('called');
        expect(spy).to.have.been.called();
        done();
        Authentication.checkDocumentOwner(req, res, next);
      });

      it('should continue if user is document owner',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/4',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId },
          params: { id: 4 }
        });
        const next = () => 'called';

        const spy = chai.spy(next);
        expect(spy()).to.equal('called');
        expect(spy).to.have.been.called();
        done();
        Authentication.checkDocumentOwner(req, res, next);
      });

      it('should continue if user is admin',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/4',
          headers: { authorization: adminUserToken },
          decoded: { roleId: adminUser.roleId },
          params: { id: 4 }
        });
        const next = () => 'called';

        const spy = chai.spy(next);
        expect(spy()).to.equal('called');
        expect(spy).to.have.been.called();
        done();
        Authentication.checkDocumentOwner(req, res, next);
      });
    });

    // checkCurrentUser middleware
    describe('checkCurrentUser:', () => {
      it('should not continue if id is invalid',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/invalidId',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId },
          params: { id: 'invalidId' }
        });

        res.on('end', () => {
          expect(res._getData().message).to
            .equal('An error occured. Ensure your parameters are valid!');
          done();
        });

        Authentication.checkCurrentUser(req, res);
      });

      it('should not continue if user is not found',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/12345',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId },
          params: { id: 12345 }
        });

        res.on('end', () => {
          expect(res._getData().message).to.equal('User Not Found');
          done();
        });

        Authentication.checkCurrentUser(req, res);
      });

      it('should not continue if userid is not current user',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/3',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId, userId: regularUser.id },
          params: { id: 3 }
        });

        res.on('end', () => {
          expect(res._getData().message).to
            .equal('You are not authorized to access this user');
          done();
        });
        Authentication.checkCurrentUser(req, res);
      });

      it('should continue if userid is current user',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/2',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId, userId: regularUser.id },
          params: { id: 2 }
        });
        const next = () => 'called';

        const spy = chai.spy(next);
        expect(spy()).to.equal('called');
        expect(spy).to.have.been.called();
        done();
        Authentication.checkCurrentUser(req, res, next);
      });

      it('should continue if user is admin',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/3',
          headers: { authorization: adminUserToken },
          decoded: { roleId: adminUser.roleId, userId: adminUser.id },
          params: { id: 3 }
        });
        const next = () => 'called';

        const spy = chai.spy(next);
        expect(spy()).to.equal('called');
        expect(spy).to.have.been.called();
        done();
        Authentication.checkCurrentUser(req, res, next);
      });
    });
  });
});
