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
      // Get all documents in the app
      db.Document.findAll()
        .then(documents => res.status(201).send(documents))
        .catch(error => res.status(400).send(error))
    } else {
      // Get all documents belonging to the current user
      db.Document.findAll({
        where: { ownerId: req.decoded.userId }
      })
      .then(documents => res.status(201).send(documents))
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
        } else {
          if (document.access === 'private'
            && !isCurrentUser(req, document.ownerId)) {
              return res.status(403)
                .send({ message: 'This is a private document' });
          }
          res.send(document);
        }
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

        if (!isCurrentUser(req, document.ownerId)) {
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

        if (!isCurrentUser(req, document.ownerId)) {
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
};

export default documentsController;
