/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import supertest from 'supertest';
import chai from 'chai';
import httpMocks from 'node-mocks-http';
import events from 'events';
import sinon from 'sinon';

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

  // Test middleware functions
  describe('Middleware Functions:', () => {
    let req, res;

    const buildResponse = () =>
      httpMocks.createResponse({ eventEmitter: events.EventEmitter });

    // Authenticate a User
    describe('verifyToken - ', () => {
      it('should not authenticate a user if no token is provided', (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents'
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(401);
          expect(res._getData().message).to
            .equal('Authentication required to access this route!');
          done();
        });

        Authentication.verifyToken(req, res);
      });

      it('should not authentiacate a user if invalid token is provided', (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents',
          headers: { authorization: 'this-is-an-invalid-token' }
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(401);
          expect(res._getData().message).to
            .equal('Authentication failed due to invalid token!');
          done();
        });

        Authentication.verifyToken(req, res);
      });

      it('should authenticate a user if valid token is provided', () => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/3',
          headers: { authorization: regularUserToken },
        });
        const middlewareStub = {
          next: () => {}
        };
        sinon.spy(middlewareStub, 'next');
        Authentication.verifyToken(req, res, middlewareStub.next);
        expect(middlewareStub.next).to.have.been.calledOnce;
      });
    });

    // Authenticate an admin - strictly admin route
    describe('verifyAdmin - ', () => {
      it('should not authentiacate an admin if user is not admin', (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents',
          headers: { authorization: regularUserToken },
          decoded: { roleId: regularUser.roleId }
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(403);
          expect(res._getData().message).to
            .equal('Access Restricted; You are not an admin!');
          done();
        });

        Authentication.verifyAdmin(req, res);
      });

      it('should authenticate an admin if user is admin', () => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents',
          headers: { authorization: adminUserToken },
          decoded: { roleId: adminUser.roleId }
        });
        const middlewareStub = {
          next: () => {}
        };
        sinon.spy(middlewareStub, 'next');
        Authentication.verifyAdmin(req, res, middlewareStub.next);
        expect(middlewareStub.next).to.have.been.calledOnce;
      });
    });

    // checkDocumentOwner middleware
    describe('checkDocumentOwner:', () => {
      it('should not continue if id is invalid',
      (done) => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/invalidId',
          decoded: { roleId: regularUser.roleId },
          params: { id: 'invalidId' }
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(400);
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
          decoded: { roleId: regularUser.roleId },
          params: { id: 12345 }
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(404);
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
          decoded: { roleId: regularUser.roleId },
          params: { id: 2 }
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(403);
          expect(res._getData().message).to
            .equal('You are not authorized to access this document');
          done();
        });
        Authentication.checkDocumentOwner(req, res);
      });

      it('should continue if document is public and user is not owner',
      () => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/3',
          decoded: { roleId: regularUser.roleId },
          params: { id: 3 }
        });
        const middlewareStub = {
          next: () => {}
        };
        sinon.spy(middlewareStub, 'next');
        Authentication.checkDocumentOwner(req, res, middlewareStub.next);
        expect(middlewareStub.next).to.have.been.calledOnce;
      });

      it('should continue if user is document owner',
      () => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/4',
          decoded: { roleId: regularUser.roleId },
          params: { id: 4 }
        });

        const middlewareStub = {
          next: () => {}
        };
        sinon.spy(middlewareStub, 'next');
        Authentication.checkDocumentOwner(req, res, middlewareStub.next);
        expect(middlewareStub.next).to.have.been.calledOnce;
      });

      it('should continue if user is admin',
      () => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/4',
          decoded: { roleId: adminUser.roleId },
          params: { id: 4 }
        });
        const middlewareStub = {
          next: () => {}
        };
        sinon.spy(middlewareStub, 'next');
        Authentication.checkDocumentOwner(req, res, middlewareStub.next);
        expect(middlewareStub.next).to.have.been.calledOnce;
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
          decoded: { roleId: regularUser.roleId },
          params: { id: 'invalidId' }
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(400);
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
          decoded: { roleId: regularUser.roleId },
          params: { id: 12345 }
        });
        res.on('end', () => {
          expect(res.statusCode).to.equal(404);
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
          decoded: { roleId: regularUser.roleId, userId: regularUser.id },
          params: { id: 3 }
        });

        res.on('end', () => {
          expect(res.statusCode).to.equal(403);
          expect(res._getData().message).to
            .equal('You are not authorized to access this user');
          done();
        });
        Authentication.checkCurrentUser(req, res);
      });

      it('should continue if userid is current user',
      () => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/documents/2',
          decoded: { roleId: regularUser.roleId, userId: regularUser.id },
          params: { id: 2 }
        });
        const middlewareStub = {
          next: () => {}
        };
        sinon.spy(middlewareStub, 'next');
        Authentication.checkCurrentUser(req, res, middlewareStub.next);
        expect(middlewareStub.next).to.have.been.calledOnce;
      });

      it('should continue if user is admin',
      () => {
        res = buildResponse();
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/3',
          decoded: { roleId: adminUser.roleId, userId: adminUser.id },
          params: { id: 3 }
        });
        const middlewareStub = {
          next: () => {}
        };
        sinon.spy(middlewareStub, 'next');
        Authentication.checkCurrentUser(req, res, middlewareStub.next);
        expect(middlewareStub.next).to.have.been.calledOnce;
      });
    });
  });
});
