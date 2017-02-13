import rolesController from '../controllers/roles';
import Authentication from '../middlewares/authentication';

const rolesRoute = (router) => {
  // Create a new type or get all roles
  router.route('/roles')
   .post(rolesController.create)
   .get(Authentication.verifyToken, Authentication.verifyAdmin, rolesController.list);

  // Get, update and delete a particular role
  router.route('/roles/:id')
    .get(Authentication.verifyToken, Authentication.verifyAdmin, rolesController.retrieve)
    .put(Authentication.verifyToken, Authentication.verifyAdmin, rolesController.update)
    .delete(Authentication.verifyToken, Authentication.verifyAdmin, rolesController.delete);
};

export default rolesRoute;
