import documentsController from '../controllers/documents';

const documentsRoute = (router) => {
  // Create a new document or get all documents
  router.route('/documents')
   .post(documentsController.create)
   .get(documentsController.list);

  // Get, update and delete a particular document
  router.route('/documents/:id')
    .get(documentsController.retrieve)
    .put(documentsController.update)
    .delete(documentsController.destroy);
};

export default documentsRoute;
