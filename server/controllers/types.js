import db from '../models';

const typesController = {
   /**
   * Create a new Type
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  create(req, res) {
    db.Type
      .create({
        title: req.body.title
      })
      .then(type => res.status(201).send(type))
      .catch(error => res.status(400).send(error));
  },

  /**
   * List all Types
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  list(req, res) {
    const query = {};
    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    db.Type
      .findAndCountAll(query)
      .then(types => res.status(200).send({
        types: types.rows, count: types.count
      }));
  },

  /**
   * Retrieve a Type based on specified id with associated documents
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  retrieve(req, res) {
    db.Type
      .findById(req.params.id)
      .then((type) => {
        if (!type) {
          return res.status(404).send({
            message: 'Type Not Found',
          });
        }
        res.status(200).send(type);
      })
      .catch(error => res.status(400).send(error));
  },

  /**
   * Update a Type based on supplied id
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  update(req, res) {
    db.Type
      .findById(req.params.id)
      .then((type) => {
        if (!type) {
          return res.status(404).send({
            message: 'Type Not Found',
          });
        }

        type
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedType => res.status(200).send(updatedType));
      })
      .catch(error => res.status(400).send(error));
  },

  /**
   * Delete a Type based on supplied id
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  delete(req, res) {
    db.Type
      .findById(req.params.id)
      .then((type) => {
        if (!type) {
          return res.status(404).send({
            message: 'Type Not Found',
          });
        }

        type
          .destroy()
          .then(() => res.status(200).send({
            message: 'Type deleted successfully.',
          }));
      })
      .catch(error => res.status(400).send(error));
  },
};

export default typesController;
