import typesController from '../controllers/types';

const typesRoute = (router) => {
  // Create a new type or get all types
  router.route('/types')
   .post(typesController.create)
   .get(typesController.list);

  // Get, update and delete a particular type
  router.route('/types/:id')
    .get(typesController.retrieve)
    .put(typesController.update)
    .delete(typesController.destroy);
};

export default typesRoute;
