import jwt from 'jsonwebtoken';
import db from '../models';
import Helpers from './helpers';

/**
 * Secret token for jsonwebtoken
 */
const secret = process.env.SECRET || 'my secret key';

const usersController = {
  /**
   * Login a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  login(req, res) {
    db.User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) {
          if (user.validatePassword(req.body.password)) {
            const token = jwt.sign({ userId: user.id, roleId: user.roleId}, 
            secret, { expiresIn: '1 day' });
            return res.status(200).send({token, user});
          }
        }
        res.status(401)
            .send({ message: 'Invalid Login Details!' });
      })
      .catch(error => res.status(400).send(error));
  },

 /**
   * Create a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  create(req, res) {
    //Helpers.createRoles(req);
    db.User.findOne({ where: { email: req.body.email } })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).send({ 
            message: `Oops! A user already exists with this email: ${req.body.email}` 
          });
        }

        if (!req.body.roleId) {
          req.body.roleId = 2;
        }

        db.User
          .create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            roleId: req.body.roleId,
          })
          .then((user) => {
            const token = jwt.sign({ userId: user.id, roleId: user.roleId}, 
            secret, { expiresIn: '1 day' });
            res.status(201).send({token, user});
          })
          .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
  },

   /**
   * List all users
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  list(req, res) {
    db.User
      .findAll()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },

   /**
   * Retrive a user's details
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  retrieveUser(req, res) {
    db.User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        if (Helpers.isAdmin(req) || Helpers.isCurrentUser(req, user.id)) {
          res.status(200).send(user);
        } else {
          res.status(403)
            .send({ message: 'You can only retrieve your information!' });
        }
      })
      .catch(error => res.status(400).send(error));
  },

   /**
   * Retrieve a user's details with documents owned by the user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  retrieveDocuments(req, res) {
    db.User
      .findById(req.params.id, {
        include: [{
          model: db.Document,
          as: 'documents',
        }],
      })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }

        if (Helpers.isAdmin(req) || Helpers.isCurrentUser(req, user.id)) {
          res.status(200).send(user);
        } else {
          res.status(403)
            .send({ message: 'You can only retrieve your documents!' });
        }
      })
      .catch(error => res.status(400).send(error));
  },

   /**
   * Update a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  updateUser(req, res) {
    db.User
      .findById(req.params.id, {
        include: [{
          model: db.Document,
          as: 'documents',
        }],
      })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }

        if (Helpers.isAdmin(req) || Helpers.isCurrentUser(req, user.id)) {
          user
            .update(req.body, { fields: Object.keys(req.body) })
            .then(updatedUser => res.status(200).send(updatedUser))
            .catch(error => res.status(400).send(error)); 
        } else {
          res.status(403)
            .send({ message: 'You can only update your details!' });
        }
      })
      .catch(error => res.status(400).send(error));
  },

   /**
   * Delete a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  deleteUser(req, res) {
    db.User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        
        user
          .destroy()
          .then(() => res.status(200).send({
            message: 'User deleted successfully.',
          }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};

export default usersController;
