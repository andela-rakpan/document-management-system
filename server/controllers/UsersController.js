import jwt from 'jsonwebtoken';
import db from '../models';


const secret = process.env.SECRET || 'my secret key';

/**
 * UsersController class to create and manage users
 */
class UsersController {
  /**
   * Login a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static login(req, res) {
    const query = {
      where: { email: req.body.email }
    };
    db.User.findOne(query)
      .then((user) => {
        if (user && user.validatePassword(req.body.password)) {
          const token = jwt.sign({ userId: user.id, roleId: user.roleId },
          secret, { expiresIn: '1 day' });
          return res.status(200).send({
            token,
            userId: user.id,
            roleId: user.roleId
          });
        }

        res.status(401)
            .send({ message: 'Invalid Login Details!' });
      });
  }

   /**
   * Logout a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static logout(req, res) {
    res.status(200)
      .send({ message: 'Successfully logged out!' });
  }

 /**
   * Create a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static create(req, res) {
    db.User.findOne({ where: { email: req.body.email } })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).send({
            message: 'Oops! A user already exists with this email'
          });
        }

        db.User
          .create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            roleId: 2,
          })
          .then((user) => {
            const token = jwt.sign({ userId: user.id, roleId: user.roleId },
            secret, { expiresIn: '1 day' });
            res.status(201).send({ token,
              user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                roleId: user.roleId
              }
            });
          })
          .catch(() => res.status(400).send({
            message: 'An error occured. Ensure your parameters are valid!'
          }));
      });
  }

   /**
   * List all users
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static list(req, res) {
    const query = {};
    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.attributes = { exclude: ['password'] };
    db.User
      .findAndCountAll(query)
      .then(users => res.status(200).send({
        users: users.rows, count: users.count
      }));
  }

   /**
   * Retrive a user's details
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static retrieveUser(req, res) {
    res.status(200).send(req.decoded.user);
  }

   /**
   * Retrieve a user's details with documents owned by the user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static retrieveDocuments(req, res) {
    const query = {
      where: { ownerId: req.decoded.user.id }
    };
    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    db.Document
      .findAndCountAll(query)
      .then(documents => res.status(200).send({
        documents: documents.rows,
        count: documents.count
      }));
  }

   /**
   * Update a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static updateUser(req, res) {
    // Prevent update on user id property
    if (req.body.id) {
      return res.status(400).send({
        message: 'You cannot edit user id property'
      });
    }
    // Prevent non-admin from updating role of a user
    if (!req.decoded.isAdmin && req.body.roleId) {
      return res.status(400).send({
        message: 'You cannot edit user roleId property'
      });
    }

    req.decoded.user
      .update(req.body, { fields: Object.keys(req.body) })
      .then(updatedUser => res.status(200).send({
        message: 'User updated successfully',
        updatedUser
      }));
  }

   /**
   * Delete a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static deleteUser(req, res) {
    db.User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }

        if (Number(req.params.id) === 1) {
          return res.status(403)
            .send({ message: 'You cannot delete default admin user account!' });
        }

        user
          .destroy()
          .then(() => res.status(200).send({
            message: 'User deleted successfully.',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }
}

export default UsersController;
