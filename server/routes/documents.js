import documentsController from '../controllers/documents';
import Authentication from '../middlewares/authentication';

const documentsRoute = (router) => {
  // Create a new document or get all documents
  router.route('/documents')
   .post(Authentication.verifyToken, documentsController.create)
   .get(Authentication.verifyToken, Authentication.isAdmin, documentsController.listAll);

  // Get, update and delete a particular document
  router.route('/documents/:id')
    .get(Authentication.verifyToken, Authentication.isAdmin, documentsController.retrieve)
    .put(Authentication.verifyToken, Authentication.isAdmin, documentsController.update)
    .delete(Authentication.verifyToken, Authentication.isAdmin, documentsController.delete);

  // Search documents
  router.route('/search/documents')
    .get(Authentication.verifyToken, Authentication.isAdmin, documentsController.search);
};

export default documentsRoute;
