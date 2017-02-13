import db from '../models';

/**
 * controllers helper functions
 */
const Helpers = {
  /**
   * isAdmin - Checks if the current user is an admin
   *
   * @param  {Object} req Request Object
   * @param  {Object} res Response Object
   * @returns {Void}     Returns Void
   */
  isAdmin(req) {    
    return db.Role.findById(req.decoded.roleId)
      .then((role) => {
        console.log(role);
        
        if (role.title === 'admin') {
          return true;
        }
        return false;
      })
      .catch(error => res.status(400).send(error));
  },

  /**
   * isOwner - Checks that the current user is the owner of the documents
   *
   * @param  {Object} req Request Object
   * @param  {Object} res Response Object
   * @returns {Object}     Filetered documents
   */
  isCurrentUser(req, userId) {
    if (userId === req.decoded.userId) {
      return true;
    } else {
      return false;
    }
  }
};

export default Helpers;