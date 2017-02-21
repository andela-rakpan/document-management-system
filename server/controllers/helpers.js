import model from '../models';

/**
 * controllers helper functions
 */
const Helpers = {
  /**
   * isAdmin - Checks if the current user is an admin
   *
   * @param  {Object} req Request Object
   * @returns {Boolean} true or false
   */
  isAdmin(req) {    
    return req.decoded.roleId === 1;
  },

  /**
   * isCurrentUser - Checks that the logged-in user is owner of the accessed id
   *
   * @param  {Object} req Request Object
   * @param  {Integer} userId Response Object
   * @returns {Boolean}     true or false
   */
  isCurrentUser(req, userId) {
    return req.decoded.userId === userId;
  }
};

export default Helpers;