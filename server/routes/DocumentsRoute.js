import DocumentsController from '../controllers/DocumentsController';
import Authentication from '../middlewares/Authentication';

const DocumentsRoute = (router) => {
  // Create a new document or get all documents
  router.route('/documents')
   .post(Authentication.verifyToken, DocumentsController.create)
   .get(Authentication.verifyToken, Authentication.isAdmin, DocumentsController.listAll);

  // Get, update and delete a particular document
  router.route('/documents/:id')
    .get(Authentication.verifyToken, Authentication.isAdmin, DocumentsController.retrieve)
    .put(Authentication.verifyToken, Authentication.isAdmin, DocumentsController.update)
    .delete(Authentication.verifyToken, Authentication.isAdmin, DocumentsController.delete);

  // Search documents
  router.route('/search/documents')
    .get(Authentication.verifyToken, Authentication.isAdmin, DocumentsController.search);
};

export default DocumentsRoute;
