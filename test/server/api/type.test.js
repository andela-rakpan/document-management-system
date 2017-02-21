import supertest from 'supertest';
import chai from 'chai';
import logger from 'fm-log';
import app from '../../../tools/devServer';
import model from '../../../server/models';
import testHelper from '../testHelper';

const expect = chai.expect; 
const request = supertest.agent(app);
const adminUser = testHelper.testUser1;
const regularUser = testHelper.testUser2;

describe('Type API:', () => {
  let adminUserToken;
  let regularUserToken;
  let type = {};

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

  // Test type http requests
  describe('TYPES REQUESTS:', ()=> {

    // POST requests - Create Types
    describe('POST: (/api/types) - CREATE TYPE', () => {
      it('should not create a type when required field is invalid', (done) => {
        const newType = { theTitle: 'letter' };
        request.post('/api/types')
          .set({ 'x-access-token': adminUserToken })
          .send(newType)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should not create a type if no token is provided', (done) => {
        const newType = { title: 'letter' };
        request.post('/api/types')
          .send(newType)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not create a type if token is invalid', (done) => {
        const newType = { title: 'letter' };
        request.post('/api/types')
          .set({ 'x-access-token': 'this-is-an-invalid-token' })
          .send(newType)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should create a type if required field is valid', (done) => {
        const newType = { title: 'letter' };
        request.post('/api/types')
          .set({ 'x-access-token': regularUserToken })
          .send(newType)
          .end((error, response) => {
            expect(response.status).to.equal(201);
            expect(response.body.title).to.equal(newType.title);
            type.id = response.body.id;
            type.title = response.body.title;
            done();
          });
      });
      it('should not create a type if type already exists', (done) => {
        const newType = { title: 'letter' };
        request.post('/api/types')
          .set({ 'x-access-token': adminUserToken })
          .send(newType)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
    });

    // GET requests - Retrieve all Types
    describe('GET: (/api/types)', () => {
      it('should not return types if NO token is provided', (done) => {
        request.get('/api/types')
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return types if token is invalid', (done) => {
        request.get('/api/types')
          .set({ 'x-access-token': 'this-is-an-invalid-token' })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should return types if token is valid', (done) => {
        request.get('/api/types')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    // GET requests - Retrieve specific type
    describe('GET: (/api/types/:id) - GET type', () => {
      it('should not return the type if supplied invalid id', (done) => {
        request.get('/api/types/12345')
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not return the type if supplied non-integer id', (done) => {
        request.get('/api/types/id')
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should not return the type if supplied token is invalid', (done) => {
        request.get(`/api/types/${type.id}`)
          .set({ 'x-access-token': 'this-is-an-invalid-token' })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should return the type if valid id is provided and user logged in', (done) => {
        request.get(`/api/types/${type.id}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            done();
          });
      });
    });

    //  PUT Requests - Edit specific type
    describe('PUT: (/api/types/:id) - EDIT type', () => {
      it('should not edit type if invalid id is supplied', (done) => {
        const fieldsToUpdate = { title: 'official' };
        request.put('/api/types/12345')
          .set({ 'x-access-token': adminUserToken })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not edit type if non-integer id is supplied', (done) => {
        const fieldsToUpdate = { title: 'official' };
        request.put('/api/types/id')
          .set({ 'x-access-token': adminUserToken })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should not edit type if user is not admin', (done) => {
        const fieldsToUpdate = { title: 'official' };
        request.put(`/api/types/${type.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should perform edit when valid id is supplied and user is admin', (done) => {
        const fieldsToUpdate = { title: 'official' };
        request.put(`/api/types/${type.id}`)
          .set({ 'x-access-token': adminUserToken })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(fieldsToUpdate.title);
            done();
          });
      });
    });

    // DELETE Requests - Delete specific type
    describe('DELETE: (/api/types/:id) - DELETE type', () => {
      it('should not delete type if invalid id is supplied', (done) => {
        request.delete('/api/types/12345')
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not delete type if non-integer id is supplied', (done) => {
        request.delete('/api/types/id')
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should not delete type if user is not admin', (done) => {
        request.delete(`/api/types/${type.id}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should delete type when valid id is supplied', (done) => {
        request.delete(`/api/types/${type.id}`)
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Type deleted successfully.');
            done();
          });
      });
    });
  });
});
