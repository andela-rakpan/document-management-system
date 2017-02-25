/* eslint-disable no-unused-expressions */

import supertest from 'supertest';
import chai from 'chai';

import testHelper from '../testHelper';
import app from '../../../tools/devServer';

const expect = chai.expect;
const request = supertest.agent(app);

const adminUser = testHelper.testUser1;
const regularUser = testHelper.testUser2;
const invalidDocument = testHelper.invalidDocument;
const privateDocument = testHelper.testDocument4;
const publicDocument = testHelper.testDocument5;

describe('User API:', () => {
  let adminUserToken;
  let regularUserToken;
  let privateDoc = {};
  let publicDoc = {};
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
            user.id = res.body.user.id;
            done();
          });
      });
  });

  // Test documents http requests
  describe('Documents REQUESTS:', () => {
    // POST requests - Create Users
    describe('POST: (/api/documents) - ', () => {
      it('should not create a document when required fields are invalid',
      (done) => {
        request.post('/api/documents')
          .send(invalidDocument)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should create a \'private\' document if document does not exists',
      (done) => {
        request.post('/api/documents')
          .send(privateDocument)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            privateDoc = response.body;
            expect(privateDoc.title).to.equal(privateDocument.title);
            expect(response.status).to.equal(201);
            done();
          });
      });

      it('should create a \'public\' document if document does not exists',
      (done) => {
        request.post('/api/documents')
          .send(publicDocument)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            publicDoc = response.body;
            expect(publicDoc.title).to.equal(publicDocument.title);
            expect(response.status).to.equal(201);
            done();
          });
      });

      it('should not create a document if document already exists', (done) => {
        request.post('/api/documents')
          .send(privateDocument)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
    });

    // GET requests - Retrieve all documents
    describe('GET: (/api/documents) - ', () => {
      it('should return \'public\' documents if user is not admin', (done) => {
        request.get('/api/documents')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0].access).to.equal('public');
            done();
          });
      });

      it('should return all documents if user is admin', (done) => {
        request.get('/api/documents')
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

    // GET requests - Retrieve specific document
    describe('GET: (/api/documents/:id) - ', () => {
      it('should not return the document if supplied invalid id', (done) => {
        request.get('/api/documents/12345')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });

      it('should not return the document if supplied non-integer id',
      (done) => {
        request.get('/api/documents/id')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should not return document if document is \'private\' '
      + 'and user is not owner/admin', (done) => {
        request.get(`/api/documents/${privateDoc.id}`)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            expect(response.body.message).to
              .equal('This is a private document');
            done();
          });
      });

      it('should return document if valid id is provided and user is admin',
      (done) => {
        request.get(`/api/documents/${privateDoc.id}`)
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            done();
          });
      });

      it('should return the document if user is owner', (done) => {
        request.get('/api/documents/2')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            done();
          });
      });

      it(`should return document if document is 'public'
      and user is not admin/owner`, (done) => {
        request.get(`/api/documents/${publicDoc.id}`)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.access).to.equal('public');
            done();
          });
      });
    });

    // GET requests - Retrieve specific user's document
    describe('GET: (/api/users/:id/documents) - ', () => {
      it('should not return user\'s documents if supplied invalid id',
      (done) => {
        request.get('/api/users/12345/documents')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });

      it('should not return user\'s documents if supplied non-integer id',
      (done) => {
        request.get('/api/users/id/documents')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should not return user\'s documents if user is not document owner',
      (done) => {
        request.get('/api/users/3/documents')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            expect(response.body.message).to
              .equal('You are not authorized to access this document(s)');
            done();
          });
      });

      it('should return user\'s documents if user is admin', (done) => {
        request.get(`/api/users/${user.id}/documents`)
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body.documents)).to.be.true;
            expect(response.body.documents.length).to.be.greaterThan(0);
            done();
          });
      });

      it('should return user\'s documents if user is owner', (done) => {
        request.get(`/api/users/${user.id}/documents`)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body.documents)).to.be.true;
            expect(response.body.documents.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    //  PUT Requests - Edit specific document
    describe('PUT: (/api/documents/:id) - ', () => {
      const fieldsToUpdate = {
        title: 'Andela Bootcamp',
        content: 'It acclaimed to be one of the most regorous learning '
          + 'experiences one can go through. And that may not be far '
          + 'from the truth if you take a closer look at Andela\'s '
          + 'acceptance ratio...'
      };

      it('should not edit document if invalid id is supplied', (done) => {
        request.put('/api/documents/12345')
          .set({
            'x-access-token': adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });

      it('should not edit document if supplied non-integer id', (done) => {
        request.put('/api/documents/id')
          .set({
            'x-access-token': adminUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should not edit document if user is not owner', (done) => {
        request.put(`/api/documents/${privateDoc.id}`)
          .set({
            'x-access-token': regularUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(403);
            expect(response.body.message).to
              .equal('You are not authorized to update this document');
            done();
          });

      });
      it('should edit document if valid id is supplied and user is owner',
      (done) => {
        request.put('/api/documents/2')
          .set({
            'x-access-token': regularUserToken
          })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(fieldsToUpdate.title);
            expect(response.body.content).to.equal(fieldsToUpdate.content);
            done();
          });
      });

      it('should edit document if valid id is supplied and user is admin',
      (done) => {
        fieldsToUpdate.title = 'The Andela Bootcamp Experience';
        request.put('/api/documents/2')
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

    // DELETE Requests - Delete specific document
    describe('DELETE: (/api/documents/:id) - ', () => {
      it('should not delete document if invalid id is supplied', (done) => {
        request.delete('/api/documents/12345')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(404);
            done();
          });
      });

      it('should not delete document if supplied non-integer id', (done) => {
        request.delete('/api/documents/id')
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });

      it('should not delete document if user is not owner', (done) => {
        request.delete(`/api/documents/${privateDoc.id}`)
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(403);
            expect(response.body.message).to
              .equal('You are not authorized to delete this document');
            done();
          });
      });

      it('should delete document if valid id is supplied and user is owner',
      (done) => {
        request.delete('/api/documents/2')
          .set({
            'x-access-token': regularUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to
              .equal('Document deleted successfully.');
            done();
          });
      });

      it('should delete document if valid id is supplied and user is admin',
      (done) => {
        request.delete(`/api/documents/${publicDoc.id}`)
          .set({
            'x-access-token': adminUserToken
          })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to
              .equal('Document deleted successfully.');
            done();
          });
      });
    });
  });
});
