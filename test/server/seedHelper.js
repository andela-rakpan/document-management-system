import faker from 'faker';
import bcrypt from 'bcrypt-nodejs';
import logger from 'fm-log';
import model from '../../server/models';
import testHelper from './testHelper';

const adminUser = testHelper.testUser1;
const regularUser1 = testHelper.testUser2;
const regularUser2 = testHelper.testUser4;
/**
 * SeedData class to populate database with default data
 */
class SeedHelper {

  /**
   * Perform the sequential population of the model
   * in order of associations
   * @return {Void} - Returns Void
   */
  static init() {
    model.sequelize.sync({ force: true })
      .then(() => {
        SeedHelper.populateRoleTable()
          .then(() => {
            SeedHelper.populateUserTable()
              .then(() => {
                SeedHelper.populateTypeTable()
                  .then(() => {
                    SeedHelper.populateDocumentTable()
                      .catch((err) => {
                        logger.error(err);
                      });
                  })
                  .catch((err) => {
                    logger.error(err);
                  });
              })
              .catch((err) => {
                logger.error(err);
              });
          })
          .catch((err) => {
            logger.error(err);
          });
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  /**
   * Populates model with default roles
   * @returns {object} - A Promise object
   */
  static populateRoleTable() {
    const roles = [testHelper.adminRole, testHelper.regularRole];
    return model.Role.bulkCreate(roles);
  }

  /**
   * Define bycript to hash password
   * @returns {String} - Hashed password
   */
  static hashPass(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
  }

  /**
   * Populates model with default users
   * @returns {object} - A Promise object
   */
  static populateUserTable() {
    adminUser.password = SeedHelper.hashPass(adminUser.password);
    regularUser1.password = SeedHelper.hashPass(regularUser1.password);
    regularUser2.password = SeedHelper.hashPass(regularUser2.password);
    const users = [adminUser, regularUser1, regularUser2];
    return model.User.bulkCreate(users);
  }

  /**
   * Populates model with default types
   * @returns {object} - A Promise object
   */
  static populateTypeTable() {
    const types = [testHelper.testType1, testHelper.testType2];
    return model.Type.bulkCreate(types);
  }

  /**
   * Populates model with default documents
   * @returns {object} - A Promise object
   */
  static populateDocumentTable() {
    const documents = [
        testHelper.testDocument1,
        testHelper.testDocument2,
        testHelper.testDocument3,
        testHelper.testDocument6,
        testHelper.testDocument7
      ];
    return model.Document.bulkCreate(documents);
  }
}

export default SeedHelper.init();