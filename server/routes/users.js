import usersController from '../controllers/users';

const usersRoute = (router) => {
  // Create a new user or get all users
  router.route('/users')
   .post(usersController.create)
   .get(usersController.list);

  // Update, delete or get a specific user
  router.route('/users/:id')
    .put(usersController.update)
    .get(usersController.retrieveUser)
    .delete(usersController.destroy);

  // Get a single user's documents
  router.route('/users/:id/documents')
    .get(usersController.retrieveDocuments);

  // // Log in a user
  // router.route('/users/login')
  //   .post(usersController.login);

  // // Log our a user
  // router.route('/users/logout')
  //   .post(usersController.logout);
};

export default usersRoute;
