import documentsController from '../controllers/documents';
import Authentication from '../middlewares/authentication';

const documentsRoute = (router) => {
  // Create a new document or get all documents
  router.route('/documents')
   .post(Authentication.verifyToken, documentsController.create)
   .get(Authentication.verifyToken, documentsController.listAll);

  // Get, update and delete a particular document
  router.route('/documents/:id')
    .get(Authentication.verifyToken, documentsController.retrieve)
    .put(Authentication.verifyToken, documentsController.update)
    .delete(Authentication.verifyToken, documentsController.delete);
  
  // Search public documents
  router.route('/search/documents/public/:term')
    .get(Authentication.verifyToken, documentsController.searchPublic);
  
  // Search onwer documents
  router.route('/search/documents/:term')
    .get(Authentication.verifyToken, documentsController.search);
};

export default documentsRoute;
