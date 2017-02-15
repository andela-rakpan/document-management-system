import supertest from 'supertest';
import chai from 'chai';
import app from '../../../tools/devServer';
import model from '../../../server/models';
import testHelper from '../testHelper';

const expect = chai.expect; 
const request = supertest.agent(app);
const adminUser = testHelper.testUser1;
const regularUser = testHelper.testUser2;
const adminRoleParams = testHelper.adminRole;
const regularRoleParams = testHelper.regularRole;


describe('Role API', () => {
  let adminUserToken;
  let regularUserToken;
  let role;

  before((done) => {
    request.post('/api/users')
      .send(adminUser)
      .end((err, res) => {
        adminUserToken = res.body.token;
        console.log(adminUserToken);
      });

    request.post('/api/users')
      .send(regularUser)
      .end((err, res) => {
        regularUserToken = res.body.token;
        console.log(regularUserToken);        
        done()
      });
  });

  after(() => model.sequelize.sync({ force: true }));

  // POST requests - Create Roles
  describe('REQUESTS', () => {
    describe('POST: (/roles) - CREATE ROLE', () => {
      it('should not create a role when required field is invalid', (done) => {
        const newRole = { theTitle: 'regular' };
         request.post('/api/roles')
          .set({ 'x-access-token': adminUserToken })
          .send(newRole)
          .expect(400)
          .end((error, response) => {
            if (error) console.log(error);
          });
      });
    });
  });
});
