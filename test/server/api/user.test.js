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
const invalidUser = testHelper.invalidUser;
const regularUser2 = testHelper.testUser3;

describe('User API:', () => {
  let adminUserToken;
  let regularUserToken;
  let user = {};

  // Test users http requests
  describe('Users REQUESTS:', ()=> {

    // POST requests - Login User
    describe('POST: (/api/users/login) - ', () => {
      it('should not login a user if required fields are invalid', (done) => {
        const newUser = {
          theEmail: regularUser.email,
          password: regularUser.password
        };
        request.post('/api/users/login')
          .send(newUser)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not login a user if user details does not exist', (done) => {
        request.post('/api/users/login')
          .send(regularUser2)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should login a user if user details exists', (done) => {
        request.post('/api/users/login')
          .send(adminUser)
          .end((error, response) => {
            adminUserToken = response.body.token;
            expect(response.status).to.equal(200);
            request.post('/api/users/login')
              .send(regularUser)
              .end((err, res) => {
                regularUserToken = res.body.token;
                expect(res.status).to.equal(200);
                done();
              });
          });
      });
    });

    // POST requests - Create Users
    describe('POST: (/api/users) - ', () => {
      it('should not create a user when required fields are invalid', (done) => {
        request.post('/api/users')
          .send(invalidUser)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
      it('should create a user if user does not exists', (done) => {
        request.post('/api/users')
          .send(regularUser2)
          .end((error, response) => {
            user = response.body.user;
            user.token = response.body.token;
            expect(response.status).to.equal(201);
            done();
          });
      });
      it('should not create a user if user already exists', (done) => {
        request.post('/api/users')
          .send(regularUser2)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
    });

    // GET requests - Retrieve all Users
    describe('GET: (/api/users) - ', () => {
      it('should not return users if NO token is provided', (done) => {
        request.get('/api/users')
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return users if token is invalid', (done) => {
        request.get('/api/users')
          .set({ 'x-access-token': 'this-is-an-invalid-token' })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return users if user is not admin', (done) => {
        request.get('/api/users')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should return users if token is valid and user is admin', (done) => {
        request.get('/api/users')
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    // GET requests - Retrieve specific user
    describe('GET: (/api/users/:id) - ', () => {
      it('should not return the user when supplied invalid id', (done) => {
        request.get('/api/users/12345')
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not return the user when user is not current user', (done) => {
        request.get(`/api/users/${user.id}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should return the user if valid id is provided and user is current user', (done) => {
        request.get(`/api/users/${user.id}`)
          .set({ 'x-access-token': user.token })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            done();
          });
      });
      it('should return the user if valid id is provided and user admin', (done) => {
        request.get(`/api/users/${user.id}`)
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            done();
          });
      });
    });

    //  PUT Requests - Edit specific user
    describe('PUT: (/api/users/:id) - ', () => {
      it('should not edit user if invalid id is supplied', (done) => {
        const fieldsToUpdate = { title: 'the super admin' };
        request.put('/api/users/12345')
          .set({ 'x-access-token': regularUserToken })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not edit user if user is not current user', (done) => {
        const fieldsToUpdate = { firstname: 'John', lastname: 'Doe' };
        request.put(`/api/users/${user.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should perform edit when valid id is supplied and user is current user', (done) => {
        const fieldsToUpdate = { firstname: 'John', lastname: 'Doe' };
        request.put(`/api/users/${user.id}`)
          .set({ 'x-access-token': user.token })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.firstname).to.equal(fieldsToUpdate.firstname);
            expect(response.body.lastname).to.equal(fieldsToUpdate.lastname);
            done();
          });
      });
      it('should perform edit when valid id is supplied and user is admin', (done) => {
        const fieldsToUpdate = { firstname: 'Shalom', lastname: 'Ayidu' };
        request.put(`/api/users/${user.id}`)
          .set({ 'x-access-token': adminUserToken })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.firstname).to.equal(fieldsToUpdate.firstname);
            expect(response.body.lastname).to.equal(fieldsToUpdate.lastname);
            done();
          });
      });
    });

    // DELETE Requests - Delete specific user
    describe('DELETE: (/api/users/:id) - ', () => {
      it('should not delete user if invalid id is supplied', (done) => {
        request.delete('/api/users/12345')
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });
      it('should not delete user if user is not admin', (done) => {
        request.delete(`/api/users/${user.id}`)
          .set({ 'x-access-token': user.token })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            done();
          });
      });
      it('should delete user when valid id is supplied and user is admin', (done) => {
        request.delete(`/api/users/${user.id}`)
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('User deleted successfully.');
            done();
          });
      });
    });
  });
});
