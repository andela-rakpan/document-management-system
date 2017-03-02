import RolesController from '../controllers/RolesController';
import Authentication from '../middlewares/Authentication';

const RolesRoute = (router) => {
  // Create a new type or get all roles
  router.route('/roles')
   .post(Authentication.verifyToken, Authentication.verifyAdmin, RolesController.create)
   .get(Authentication.verifyToken, Authentication.verifyAdmin, RolesController.list);

  // Get, update and delete a particular role
  router.route('/roles/:id')
    .get(Authentication.verifyToken, Authentication.verifyAdmin, RolesController.retrieve)
    .put(Authentication.verifyToken, Authentication.verifyAdmin, RolesController.update)
    .delete(Authentication.verifyToken, Authentication.verifyAdmin, RolesController.delete);
};

export default RolesRoute;
