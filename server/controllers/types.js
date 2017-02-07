import db from '../models';

const typesController = {
  create(req, res) {
    return db.Type
      .create({
        title: req.body.title,
      })
      .then(type => res.status(201).send(type))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return db.Type
      .all()
      .then(types => res.status(201).send(types))
      .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
    return db.Type
      .findById(req.params.id)
      .then((type) => {
        if (!type) {
          return res.status(404).send({
            message: 'Type Not Found',
          });
        }
        return res.status(200).send(type);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return db.Type
      .findById(req.params.id)
      .then((type) => {
        if (!type) {
          return res.status(404).send({
            message: 'Type Not Found',
          });
        }

        return type
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedType => res.status(200).send(updatedType))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
    return db.Type
      .findById(req.params.id)
      .then((type) => {
        if (!type) {
          return res.status(404).send({
            message: 'Type Not Found',
          });
        }

        return db.Type
          .destroy()
          .then(() => res.status(200).send({
            message: 'Type deleted successfully.',
          }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};

export default typesController;
