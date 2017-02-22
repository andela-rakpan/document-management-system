/* eslint-disable no-unused-expressions */

import supertest from 'supertest';
import chai from 'chai';

import app from '../../../tools/devServer';
import testHelper from '../testHelper';

const expect = chai.expect;
const request = supertest.agent(app);
const adminUser = testHelper.testUser1;
const regularUser = testHelper.testUser2;

describe('Role API:', () => {
  let adminUserToken;
  let regularUserToken;
  const role = {};

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

  // Test roles http requests
  describe('ROLES REQUESTS:', () => {
    // POST requests - Create Roles
    describe('POST: (/api/roles) - CREATE ROLE', () => {
      it('should not create a role when required field is invalid', (done) => {
        const newRole = {
          theTitle: 'regular'
        };
        request.post('/api/roles')
          .set({
            'x-access-token': adminUserToken
          })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should not create a role if no token is provided', (done) => {
        const newRole = {
          title: 'super admin'
        };
        request.post('/api/roles')
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not create a role if user is not admin', (done) => {
        const newRole = {
          title: 'super admin'
        };
        request.post('/api/roles')
          .set({
            'x-access-token': regularUserToken
          })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should not create a role if token is invalid', (done) => {
        const newRole = {
          title: 'super admin'
        };
        request.post('/api/roles')
          .set({
            'x-access-token': 'this-is-an-invalid-token'
          })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should create a role if required field is valid and user is admin',
      (done) => {
        const newRole = {
          title: 'super admin'
        };
        request.post('/api/roles')
          .set({
            'x-access-token': adminUserToken
          })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(201);
            expect(response.body.title).to.equal(newRole.title);
            role.id = response.body.id;
            role.title = response.body.title;
            done();
          });
      });
      it('should not create a role if role already exists', (done) => {
        const newRole = {
          title: 'super admin'
        };
        request.post('/api/roles')
          .set({
            'x-access-token': adminUserToken
          })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
    });

    // GET requests - Retrieve all ROLES
    describe('GET: (/api/roles)', () => {
      it('should not return roles if NO token is provided', (done) => {
        request.get('/api/roles')
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return roles if token is invalid', (done) => {
        request.get('/api/roles')
          .set({
            'x-access-token': 'this-is-an-invalid-token'
          })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return roles if user is not admin', (done) => {
        request.get('/api/roles')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should return roles if token is valid and user is admin', (done) => {
        request.get('/api/roles')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    // GET requests - Retrieve specific role
    describe('GET: (/api/roles/:id) - GET ROLE', () => {
      it('should not return the role when supplied invalid id', (done) => {
        request.get('/api/roles/12345')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not return the role when supplied non-integer id', (done) => {
        request.get('/api/roles/id')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not return the role when user is not admin', (done) => {
        request.get(`/api/roles/${role.id}`)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should return the role when valid id is provided and user is admin',
      (done) => {
        request.get(`/api/roles/${role.id}`)
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            done();
          });
      });
    });

    //  PUT Requests - Edit specific role
    describe('PUT: (/api/roles/:id) - EDIT ROLE', () => {
      it('should not edit role if invalid id is supplied', (done) => {
        const fieldsToUpdate = {
          title: 'the super admin'
        };
        request.put('/api/roles/12345')
          .set({
            'x-access-token': adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not edit role if non-integer id is supplied', (done) => {
        const fieldsToUpdate = {
          title: 'the super admin'
        };
        request.put('/api/roles/id')
          .set({
            'x-access-token': adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should not edit role if user is not admin', (done) => {
        const fieldsToUpdate = {
          title: 'the super admin'
        };
        request.put(`/api/roles/${role.id}`)
          .set({
            'x-access-token': regularUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should perform edit when valid id is supplied and user is admin',
      (done) => {
        const fieldsToUpdate = {
          title: 'the super admin'
        };
        request.put(`/api/roles/${role.id}`)
          .set({
            'x-access-token': adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(fieldsToUpdate.title);
            done();
          });
      });
    });

    // DELETE Requests - Delete specific role
    describe('DELETE: (/api/roles/:id) - DELETE ROLE', () => {
      it('should not delete role if invalid id is supplied', (done) => {
        request.delete('/api/roles/12345')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not delete role if non-integer id is supplied', (done) => {
        request.delete('/api/roles/id')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should not delete role if user is not admin', (done) => {
        request.delete(`/api/roles/${role.id}`)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should delete role when valid id is supplied', (done) => {
        request.delete(`/api/roles/${role.id}`)
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to
              .equal('Role deleted successfully.');
            done();
          });
      });
    });
  });
});
