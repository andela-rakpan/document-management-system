import db from '../models';
import ControllerHelper from '../helpers/ControllerHelper';

/**
 * RolesController class to create and manage roles
 */
class RolesController {
  /**
   * Create a new Role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static create(req, res) {
    db.Role
      .create({
        title: req.body.title
      })
      .then(role => res.status(201).send(role))
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }

  /**
   * List all Roles
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static list(req, res) {
    const query = {};
    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    db.Role
      .findAndCountAll(query)
      .then((roles) => {
        const pagination = ControllerHelper.pagination(
          query.limit, query.offset, roles.count
        );
        res.status(200).send({
          pagination, roles: roles.rows
        });
      });
  }

  /**
   * Retrive a Role based on id with associated users on that role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static retrieve(req, res) {
    db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        res.status(200).send(role);
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }

  /**
   * Update a Role based on id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static update(req, res) {
    db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }

        if (role.title === 'admin' || role.title === 'regular') {
          return res.status(400).send({
            message: 'You cannot update default roles',
          });
        }

        role
          .update(req.body, {
            fields: Object.keys(req.body)
          })
          .then(updatedRole => res.status(200).send(updatedRole));
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }

  /**
   * Delete a Role based on id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  static delete(req, res) {
    db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        if (role.title === 'admin' || role.title === 'regular') {
          return res.status(400).send({
            message: 'You cannot delete default roles',
          });
        }

        role
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully.',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }
}

export default RolesController;
