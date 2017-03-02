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
    db.Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document Not Found',
          });
        }

        if (req.decoded.isAdmin) {
          return res.status(200).send(document);
        }

        if (document.access === 'private' &&
        !(req.decoded.userId === document.ownerId)) {
          return res.status(403)
            .send({ message: 'This is a private document' });
        }

        res.status(200).send(document);
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  },

  /**
   * Update a document based on the id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  update(req, res) {
    db.Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document Not Found',
          });
        }

        if (!req.decoded.isAdmin &&
          !(req.decoded.userId === document.ownerId)) {
          return res.status(403).send({
            message: 'You are not authorized to update this document'
          });
        }

        document
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedDocument => res.status(200).send({
            message: 'Update successful!',
            updatedDocument
          }));
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
      }));
  },

  /**
   * Delete a particular Document
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  delete(req, res) {
    db.Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'This document does not exist',
          });
        }

        if (!req.decoded.isAdmin &&
        !(req.decoded.userId === document.ownerId)) {
          return res.status(403).send({
            message: 'You are not authorized to delete this document'
          });
        }

        document
          .destroy()
          .then(() => res.status(200).send({
            message: 'Document deleted successfully.',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Ensure your parameters are valid!'
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
