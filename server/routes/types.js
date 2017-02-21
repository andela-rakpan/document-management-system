import typesController from '../controllers/types';
import Authentication from '../middlewares/authentication';

const typesRoute = (router) => {
  // Create a new type or get all types
  router.route('/types')
   .post(Authentication.verifyToken, typesController.create)
   .get(Authentication.verifyToken, typesController.list);

  // Get, update and delete a particular type
  router.route('/types/:id')
    .get(Authentication.verifyToken, typesController.retrieve)
    .put(Authentication.verifyToken, Authentication.verifyAdmin, typesController.update)
    .delete(Authentication.verifyToken, Authentication.verifyAdmin, typesController.delete);
};

export default typesRoute;
