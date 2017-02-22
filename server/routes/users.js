import usersController from '../controllers/users';
import Authentication from '../middlewares/authentication';

const usersRoute = (router) => {
  // Create a new user or get all users
  router.route('/users')
   .post(usersController.create)
   .get(Authentication.verifyToken, Authentication.verifyAdmin, usersController.list);

  // Update, delete or get a specific user
  router.route('/users/:id')
    .put(Authentication.verifyToken, usersController.updateUser)
    .get(Authentication.verifyToken, usersController.retrieveUser)
    .delete(Authentication.verifyToken, Authentication.verifyAdmin, usersController.deleteUser);

  // Get a single user's documents
  router.route('/users/:id/documents')
    .get(Authentication.verifyToken, usersController.retrieveDocuments);

  // Log in a user
  router.route('/users/login')
    .post(usersController.login);

  // Log out a user
  router.route('/users/logout')
    .post(Authentication.verifyToken, usersController.logout);
};

export default usersRoute;
