
import chai from 'chai';
import model from '../../../server/models';
import testHelper from '../testHelper';

const expect = chai.expect;
const typeParams = testHelper.testType3;

describe('Type MODEL:', () => {
  describe('Create Type:', () => {
    let type;
    before((done) => {
      model.Type.create(typeParams)
        .then((createdType) => {
          type = createdType;
          done();
        });
    });

    after(() => model.Type.destroy({ where: { id: type.id } }));

    it('should be able to create a type', () => {
      expect(type).to.exist;
      expect(typeof type).to.equal('object');
    });

    it('should be able to create a type that has a title', () => {
      expect(type.title).to.equal(typeParams.title);
    });
  });

  describe('Type Model Validations', () => {
    describe('Title Field Validation', () => {
      it('requires title field to create a type', (done) => {
        model.Type.create()
          .catch((error) => {
            expect(/notNull Violation/.test(error.message)).to.be.true;
            done();
          });
      });

      it('ensures a type is unique', (done) => {
        model.Type.create(typeParams)
          .then(() => {
            model.Type.create(typeParams)
              .catch((error) => {
                expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                done();
              });
          });
      });
    });
  });
});