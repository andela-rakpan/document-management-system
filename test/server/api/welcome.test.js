import supertest from 'supertest';
import chai from 'chai';

import app from '../../../lib/devServer';

const expect = chai.expect;
const request = supertest.agent(app);

describe('Welcome Users to Document Management System API:', () => {
  it('should display a welcome message', () => {
    request.get('/')
    .end((error, response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to
        .equal('Welcome to the Document Management System API');
    });
  });
});
