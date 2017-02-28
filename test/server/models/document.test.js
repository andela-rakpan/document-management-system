/* eslint-disable no-unused-expressions */

import chai from 'chai';
import model from '../../../server/models';
import testHelper from '../testHelper';

const expect = chai.expect;
const documentParams = testHelper.testDocument8;

const requiredFields = ['title', 'content', 'ownerId', 'access'];

describe('Document MODEL:', () => {
  describe('Create Document', () => {
    let document = {};
    before((done) => {
      model.Document.create(documentParams)
        .then((createdDocument) => {
          document = createdDocument;
          done();
        });
    });

    after(() => model.Document.destroy({ where: { id: document.id } }));

    it('should be able to create a document', () => {
      expect(document).to.exist;
      expect(typeof document).to.equal('object');
    });

    it('should create a document with title and content', () => {
      expect(document.title).to.equal(documentParams.title);
      expect(document.content).to.equal(documentParams.content);
    });

    it('should create a document with correct ownerId', () => {
      expect(document.ownerId).to.equal(2);
    });

    it('should create a document with published date', () => {
      expect(document.createdAt).to.exist;
    });

    it('should create a document with access set to public', () => {
      expect(document.access).to.equal('public');
    });
  });

  describe('Document Model Validations', () => {
    let document = {};
    describe('Required Fields Validation', () => {
      document = model.Document.build(documentParams);
      requiredFields.forEach((field) => {
        it(`requires a ${field} field to create a document`, (done) => {
          document[field] = null;
          document.save()
            .catch((error) => {
              expect(/notNull Violation/.test(error.message)).to.be.true;
              done();
            });
        });
      });
    });

    describe('Unique Fields Validation', () => {
      it('ensures a document is unique', (done) => {
        model.Document.create(documentParams)
          .then(() => {
            model.Document.create(documentParams)
              .catch((error) => {
                expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                done();
              });
          });
      });
    });
  });
});
