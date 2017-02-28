import jwt from 'jsonwebtoken';
import db from '../models';

/**
 * Secret token for jsonwebtoken
 */
const secret = process.env.SECRET || 'my secret key';

const Authentication = {

  /**
   * verifyToken - Verifies if a token supplied is valid or not
   *
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Status
   */
  verifyToken(req, res, next) {
    const token = req.headers.authorization || req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({
        message: 'Authentication required to access this route!'
      });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: 'Authentication failed due to invalid token!'
        });
      }
      req.decoded = decoded;
      next();
    });
  },

  /**
   * verifyAdmin - Verifies that the user role supplied is an admin
   * For strictly admin routes
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Object
   */
  verifyAdmin(req, res, next) {
    db.Role.findById(req.decoded.roleId)
      .then((role) => {
        if (role.title === 'admin') {
          next();
        } else {
          return res.status(403).send({
            message: 'Access Restricted; You are not an admin!'
          });
        }
      });
  },

  /**
   * isAdmin - Verifies if the user is an admin or not
   *
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Object
   */
  isAdmin(req, res, next) {
    req.decoded.isAdmin = false;
    db.Role.findById(req.decoded.roleId)
      .then((role) => {
        if (role.title === 'admin') {
          req.decoded.isAdmin = true;
        }
        next();
      });
  }
};

export default Authentication;
