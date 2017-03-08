import db from '../models';
import Helper from '../helpers/Helper';

let pagination;

/**
 * TypesController class to create and manage document types
 */
class TypesController {
   /**
   * Create a new Type
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  static create(req, res) {
    db.Type
      .create({
        title: req.body.title
      })
      .then(type => res.status(201).send(type))
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }

  /**
   * List all Types
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  static list(req, res) {
    const query = {};
    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    db.Type
      .findAndCountAll(query)
      .then((types) => {
        pagination = Helper.pagination(
          query.limit, query.offset, types.count
        );
        res.status(200).send({
          pagination, types: types.rows
        });
      });
  }

  /**
   * Retrieve a Type based on specified id with associated documents
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  static retrieve(req, res) {
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
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }

  /**
   * Update a Type based on supplied id
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  static update(req, res) {
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
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }

  /**
   * Delete a Type based on supplied id
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  static delete(req, res) {
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
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  }
}

export default TypesController;
