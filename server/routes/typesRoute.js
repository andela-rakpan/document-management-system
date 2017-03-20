import TypesController from '../controllers/TypesController';
import Authentication from '../middlewares/Authentication';

const typesRoute = (router) => {
  // Create a new type or get all types
  router.route('/types')
   .post(Authentication.verifyToken, TypesController.create)
   .get(Authentication.verifyToken, TypesController.list);

  // Get, update and delete a particular type
  router.route('/types/:id')
    .get(Authentication.verifyToken, TypesController.retrieve)
    .put(Authentication.verifyToken, Authentication.verifyAdmin, TypesController.update)
    .delete(Authentication.verifyToken, Authentication.verifyAdmin, TypesController.delete);
};

export default typesRoute;
