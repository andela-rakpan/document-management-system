import db from '../models';

const DocumentsController = {
  /**
   * Create a new Document
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  create(req, res) {
    db.Document
      .create({
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        ownerId: req.decoded.userId,
        typeId: req.body.typeId,
      })
      .then(document => res.status(201).send(document))
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  },

  /**
   * List all Documents
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  listAll(req, res) {
    let query = {};
    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    if (req.decoded.isAdmin) {
      db.Document
        .findAndCountAll(query)
        .then(documents => res.status(200).send({
          documents: documents.rows, count: documents.count
        }));
    } else {
      query = {
        where: { access: 'public' }
      };
      db.Document
        .findAndCountAll(query)
        .then(documents => res.status(200).send({
          documents: documents.rows, count: documents.count
        }));
    }
  },

  /**
   * Retrieve a specific document based on the id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  retrieve(req, res) {
    res.status(200).send(req.decoded.document);
  },

  /**
   * Update a document based on the id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  update(req, res) {
    // Ensure that the onwerId property is not updated!
    if (req.body.ownerId && !req.decoded.isAdmin) {
      return res.status(400).send({
        message: 'You cannot edit document ownerId property'
      });
    }
    req.decoded.document
      .update(req.body, { fields: Object.keys(req.body) })
      .then(updatedDocument => res.status(200).send({
        message: 'Update successful!',
        updatedDocument
      }));
  },

  /**
   * Delete a particular Document
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  delete(req, res) {
    req.decoded.document
      .destroy()
      .then(() => res.status(200).send({
        message: 'Document deleted successfully.',
      }));
  },

  /**
   * Gets all public documents relevant to search term
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} - Returns response object
   */
  search(req, res) {
    const term = req.query.term;

    if (term === '') {
      return res.status(400).send({
        message: 'Invalid Search Parameter!'
      });
    }
    let query = {
      where: {
        $and: [{
          $or: {
            title: {
              $iLike: `%${term}%`
            },
            content: {
              $iLike: `%${term}%`
            }
          }
        }, {
          $or: {
            access: { $ne: 'private' },
            ownerId: req.decoded.userId
          }
        }
        ]
      }
    };

    if (req.decoded.isAdmin) {
      query = {
        where: {
          $or: {
            title: {
              $iLike: `%${term}%`
            },
            content: {
              $iLike: `%${term}%`
            }
          }
        }
      };
    }

    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = '"createdAt" DESC';
    db.Document
      .findAndCountAll(query)
      .then(documents => res.status(200).send({
        documents: documents.rows, count: documents.count
      }));
  },
};

export default DocumentsController;
