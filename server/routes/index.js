import sersRoute from './usersRoute';
import documentsRoute from './documentsRoute';
import rolesRoute from './rolesRoute';
import typesRoute from './typesRoute';

const Routes = (router) => {
  usersRoute(router);
  documentsRoute(router);
  rolesRoute(router);
  typesRoute(router);
};

export default routes;
