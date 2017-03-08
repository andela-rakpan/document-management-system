/* eslint-disable no-unused-expressions */

import supertest from 'supertest';
import chai from 'chai';

import app from '../../../lib/devServer';
import TestHelper from '../helpers/TestHelper';

const expect = chai.expect;
const request = supertest.agent(app);
const adminUser = TestHelper.testUser1;
const regularUser = TestHelper.testUser2;

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
            Authorization: adminUserToken
          })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should not create a role if user is not admin', (done) => {
        const newRole = {
          title: 'super admin'
        };
        request.post('/api/roles')
          .set({
            Authorization: regularUserToken
          })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(403);
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
            Authorization: adminUserToken
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
            Authorization: adminUserToken
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
      it('should not return roles if user is not admin', (done) => {
        request.get('/api/roles')
          .set({
            Authorization: regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });

      it('should return roles if token is valid and user is admin', (done) => {
        request.get('/api/roles')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body.roles)).to.be.true;
            expect(response.body.roles.length).to.equal(3);
            done();
          });
      });
    });

    // GET requests - Retrieve specific role
    describe('GET: (/api/roles/:id) - GET ROLE', () => {
      it('should not return the role when supplied invalid id', (done) => {
        request.get('/api/roles/12345')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });

      it('should not return the role when supplied non-integer id', (done) => {
        request.get('/api/roles/id')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should not return the role when user is not admin', (done) => {
        request.get(`/api/roles/${role.id}`)
          .set({
            Authorization: regularUserToken
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
            Authorization: adminUserToken
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
            Authorization: adminUserToken
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
            Authorization: adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should not edit role if id is default admin role', (done) => {
        const fieldsToUpdate = {
          title: 'the super admin'
        };
        request.put('/api/roles/1')
          .set({
            Authorization: adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to
              .equal('You cannot update default roles');
            done();
          });
      });

      it('should not edit role if id is default regular role', (done) => {
        const fieldsToUpdate = {
          title: 'the super admin'
        };
        request.put('/api/roles/2')
          .set({
            Authorization: adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to
              .equal('You cannot update default roles');
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
            Authorization: adminUserToken
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
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });

      it('should not delete role if non-integer id is supplied', (done) => {
        request.delete('/api/roles/id')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should delete role when valid id is supplied', (done) => {
        request.delete(`/api/roles/${role.id}`)
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to
              .equal('Role deleted successfully.');
            done();
          });
      });

      it('should not delete if role is default admin role', (done) => {
        request.delete('/api/roles/1')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to
              .equal('You cannot delete default roles');
            done();
          });
      });

      it('should not delete if role is default regular role', (done) => {
        request.delete('/api/roles/2')
          .set({
            Authorization: adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to
              .equal('You cannot delete default roles');
            done();
          });
      });
    });
  });
});
