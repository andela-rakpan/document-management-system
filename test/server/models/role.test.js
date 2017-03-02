/* eslint-disable no-unused-expressions */

import chai from 'chai';
import model from '../../../server/models';
import TestHelper from '../TestHelper';

const expect = chai.expect;
const roleParams = TestHelper.roleParams;

describe('Role MODEL:', () => {
  describe('Create Role:', () => {
    let role;
    before((done) => {
      model.Role.create(roleParams)
        .then((createdRole) => {
          role = createdRole;
          done();
        });
    });

    after(() => model.Role.destroy({ where: { id: role.id } }));

    it('should be able to create a role', () => {
      expect(role).to.exist;
      expect(typeof role).to.equal('object');
    });

    it('should be able to create a role that has a title', () => {
      expect(role.title).to.equal(roleParams.title);
    });
  });

  describe('Role Model Validations', () => {
    describe('Title Field Validation', () => {
      it('requires title field to create a role', (done) => {
        model.Role.create()
          .catch((error) => {
            expect(/notNull Violation/.test(error.message)).to.be.true;
            done();
          });
      });

      it('ensures a role is unique', (done) => {
        model.Role.create(roleParams)
          .then(() => {
            model.Role.create(roleParams)
              .catch((error) => {
                expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                done();
              });
          });
      });
    });
  });
});
