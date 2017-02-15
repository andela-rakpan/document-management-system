import db from '../models';

const rolesController = {
  /**
   * Create a new Role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  create(req, res) {
    db.Role
      .create({
        title: req.body.title
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(400).send(error));
  },

  /**
   * List all Roles
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  list(req, res) {
    db.Role
      .all()
      .then(roles => res.status(200).send(roles))
      .catch(error => res.status(404).send(error));
  },

  /**
   * Retrive a Role based on id with associated users on that role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  retrieve(req, res) {
    db.Role
      .findById(req.params.id, {
        include: [{
          model: db.User,
          as: 'users',
        }],
      })
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        res.status(200).send(role);
      })
      .catch(error => res.status(404).send(error));
  },

  /**
   * Update a Role based on id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  update(req, res) {
    db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }

        role
          .update(req.body, {
            fields: Object.keys(req.body)
          })
          .then(updatedRole => res.status(200).send(updatedRole))
          .catch(error => res.status(404).send(error));
      })
      .catch(error => res.status(404).send(error));
  },

  /**
   * Delete a Role based on id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  delete(req, res) {
    db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }

        db.Role
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully.',
          }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};

export default rolesController;