import db from '../models';
import Helpers from './helpers';

const documentsController = {
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
        ownerId: req.body.ownerId,
        typeId: req.body.typeId,
      })
      .then(document => res.status(201).send(document))
      .catch(error => res.status(400).send(error));
  },

  /**
   * List all Documents
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  listAll(req, res) {
    if (Helpers.isAdmin(req)) {
      db.Document
        .findAll()
        .then(documents => res.status(200).send(documents))
        .catch(error => res.status(400).send(error))
    } else {
      db.Document
        .findAll({
          where: {access: 'public'}
        })
        .then(documents => res.status(200).send(documents))
        .catch(error => res.status(400).send(error))
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

        if (Helpers.isAdmin(req)) {
          return res.status(200).send(document);
        }
          
        if (document.access === 'private' && !Helpers.isCurrentUser(req, document.ownerId)) {
            return res.status(403)
              .send({ message: 'This is a private document' });
        }

        res.send(document);
      })
      .catch(error => res.status(400).send(error));
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

        if (!Helpers.isAdmin(req) && !Helpers.isCurrentUser(req, document.ownerId)) {
           return res.status(403)
            .send({ message: 'This document does not belong to you' });
        }
        
        document
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedDocument => res.status(200).send(updatedDocument))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
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

        if (!Helpers.isAdmin(req) && !Helpers.isCurrentUser(req, document.ownerId)) {
          return res.status(403)
            .send({ message: 'This document does not belong to you' });
        }

        document
          .destroy()
          .then(() => res.status(200).send({
            message: 'Document deleted successfully.',
          }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

  /**
   * Gets all public documents relevant to search term
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} - Returns response object
   */
  searchPublic(req, res) {
    const term = req.params.term;

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
          $and: {
            access: 'public',
            ownerId: { $ne: req.decoded.userId } 
          }
        }
        ]
      }
    };

    if (Helpers.isAdmin(req)) {
      query = { where: {
        $or: {
          title: {
            $iLike: `%${term}%`
          },
          content: {
            $iLike: `%${term}%`
          }
        }
      }};
    }
    query.order = '"createdAt" DESC';
    db.Document
      .findAll(query)
      .then(documents => res.status(200).send(documents))
      .catch(error => res.status(400).send(error));
  },

   /**
   * Gets all owner documents relevant to search term
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} - Returns response object
   */
  search(req, res) {
    const term = req.params.term;

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
          ownerId: req.decoded.userId,
        }
        ]
      }
    };

    if (Helpers.isAdmin(req)) {
      query = { where: {
        $or: {
          title: {
            $iLike: `%${term}%`
          },
          content: {
            $iLike: `%${term}%`
          }
        }
      }};
    }
    query.order = '"createdAt" DESC';
    db.Document
      .findAll(query)
      .then(documents => res.status(200).send(documents))
      .catch(error => res.status(400).send(error));
  },
};

export default documentsController;
