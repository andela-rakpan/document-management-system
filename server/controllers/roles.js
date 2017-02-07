import db from '../models';

const rolesController = {
  create(req, res) {
    return db.Role
      .create({
        title: req.body.title,
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return db.Role
      .all()
      .then(roles => res.status(201).send(roles))
      .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
    return db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return res.status(200).send(role);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }

        return role
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedRole => res.status(200).send(updatedRole))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
    return db.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }

        return db.Role
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
