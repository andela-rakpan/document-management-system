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

describe('User API:', () => {
  let adminUserToken;
  let regularUserToken;
  let user = {};

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

  // Test documents search http requests
  describe('Search Documents REQUESTS:', ()=> {

    // GET requests - Search public document(s) for specified term(s)
    describe('GET: (/api/search/documents/public/:term) - ', () => {
      const term = 'the';
      it('should not return document(s) if NO token is provided', (done) => {
        request.get(`/api/search/documents/public?term=${term}`)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return document(s) if token is invalid', (done) => {
        request.get(`/api/search/documents/public?term=${term}`)
          .set({ 'x-access-token': 'this-is-an-invalid-token' })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return document(s) if search term is empty', (done) => {
        request.get(`/api/search/documents/public?term=`)
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Invalid Search Parameter!');
            done();
          });
      });
      it('should return all matching document(s) if user is admin', (done) => {
        request.get(`/api/search/documents/public?term=${term}`)
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            done();
          });
      });
      it(`should return all 'public' matching document(s) if user is not admin`, (done) => {
        request.get(`/api/search/documents/public?term=${term}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            response.body.forEach((document)=> {
              expect(document.access).to.equal('public')
            });
            done();
          });
      });
    });

    // GET requests - Search owner document(s) for specified term(s)
    describe('GET: (/api/search/documents) - ', () => {
      const term = 'the';
      it('should not return document(s) if NO token is provided', (done) => {
        request.get(`/api/search/documents?term=${term}`)
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return document(s) if token is invalid', (done) => {
        request.get(`/api/search/documents?term=${term}`)
          .set({ 'x-access-token': 'this-is-an-invalid-token' })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
      it('should not return document(s) if search term is empty', (done) => {
        request.get(`/api/search/documents?term=`)
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Invalid Search Parameter!');
            done();
          });
      });
      it('should return all matching document(s) if user is admin', (done) => {
        request.get(`/api/search/documents?term=${term}`)
          .set({ 'x-access-token': adminUserToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            done();
          });
      });
      it(`should return all owner's matching document(s) if user is not admin`, (done) => {
        request.get(`/api/search/documents?term=${term}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            expect(Array.isArray(response.body)).to.be.true;
            response.body.forEach((document)=> {
              expect(document.ownerId).to.equal(2);
            });
            expect(response.status).to.equal(200);
            done();
          });
      });
    });
  });
});
