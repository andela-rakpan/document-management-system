import logger from 'fm-log';
import model from '../../server/models';

/**
 * ResetHelper class to reset/empty database
 */
class ResetHelper {

  /**
   * Resets the database models
   * @return {Void} - Returns Void
   */
  static init() {
    logger.notice('Resetting the Database....Please wait...');
    model.sequelize.sync({
      force: true
    })
    .then(() => {
      logger.info('Database reset completed');
    });
  }
}

export default ResetHelper.init();
