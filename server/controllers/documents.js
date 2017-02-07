import db from '../models';

const documentsController = {
  create(req, res) {
    return db.Document
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

  list(req, res) {
    return db.Document
      .all()
      .then(documents => res.status(201).send(documents))
      .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
    return db.Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document Not Found',
          });
        }
        return res.status(200).send(document);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return db.Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document Not Found',
          });
        }

        return document
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedDocument => res.status(200).send(updatedDocument))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
    return db.Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document Not Found',
          });
        }

        return document
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
