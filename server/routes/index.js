import usersRoute from './users';
import documentsRoute from './documents';
import rolesRoute from './roles';
import typesRoute from './types';

const routes = (router) => {
  usersRoute(router);
  documentsRoute(router);
  rolesRoute(router);
  typesRoute(router);
};

export default routes;
