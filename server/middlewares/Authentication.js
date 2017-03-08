import jwt from 'jsonwebtoken';
import db from '../models';

const secret = process.env.SECRET || 'my secret key';

/**
 * Authentication class to authenticate users
 */
class Authentication {

  /**
   * verifyToken - Verifies if a token supplied is valid or not
   *
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Status
   */
  static verifyToken(req, res, next) {
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
  }

  /**
   * verifyAdmin - Verifies that the user role supplied is an admin
   * For strictly admin routes
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Object
   */
  static verifyAdmin(req, res, next) {
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
  }

  /**
   * checkDocumentOwner - Verifies if the user is owner of the document
   *
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Object
   */
  static checkDocumentOwner(req, res, next) {
    db.Role.findById(req.decoded.roleId)
      .then((role) => {
        req.decoded.document = {};
        db.Document
          .findById(req.params.id)
          .then((document) => {
            if (!document) {
              return res.status(404).send({
                message: 'Document Not Found',
              });
            }

            if (!(role.title === 'admin') && document.access === 'private' &&
            !(req.decoded.userId === document.ownerId)) {
              return res.status(403)
                .send({ message: 'You are not authorized to access this document' });
            }
            req.decoded.document = document;
            next();
          })
          .catch(() => res.status(400).send({
            message: 'An error occured. Ensure your parameters are valid!'
          }));
      });
  }

  /**
   * checkCurrentUser - Verifies if the user id is current user
   *
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Object
   */
  static checkCurrentUser(req, res, next) {
    db.Role.findById(req.decoded.roleId)
      .then((role) => {
        req.decoded.user = {};
        db.User
          .findById(req.params.id, {
            attributes: { exclude: ['password'] }
          })
          .then((user) => {
            if (!user) {
              return res.status(404).send({
                message: 'User Not Found',
              });
            }

            if (!(role.title === 'admin') && !(req.decoded.userId === user.id)) {
              return res.status(403)
                .send({ message: 'You are not authorized to access this user' });
            }
            req.decoded.user = user;
            next();
          })
        .catch(() => res.status(400).send({
          message: 'An error occured. Ensure your parameters are valid!'
        }));
      });
  }
}

export default Authentication;
