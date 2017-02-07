import rolesController from '../controllers/roles';

const rolesRoute = (router) => {
  // Create a new type or get all roles
  router.route('/roles')
   .post(rolesController.create)
   .get(rolesController.list);

  // Get, update and delete a particular role
  router.route('/roles/:id')
    .get(rolesController.retrieve)
    .put(rolesController.update)
    .delete(rolesController.destroy);
};

export default rolesRoute;
