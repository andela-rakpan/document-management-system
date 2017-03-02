import UsersRoute from './UsersRoute';
import DocumentsRoute from './DocumentsRoute';
import RolesRoute from './RolesRoute';
import TypesRoute from './TypesRoute';

const Routes = (router) => {
  UsersRoute(router);
  DocumentsRoute(router);
  RolesRoute(router);
  TypesRoute(router);
};

export default Routes;
