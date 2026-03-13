import guestRoutes from "./guestRoutes";
import clientRoutes from "./clientRoutes";
import employeeRoutes from "./employeeRoutes";
import studentRoutes from "./studentRoutes";

const ROLES_ROUTES = (roleId, userRole) => {
  const routeType = [
    {
      id: 1,
      routes: guestRoutes,
    },
    {
      id: 2,
      routes: clientRoutes,
    },
    {
      id: 3,
      routes: studentRoutes,
    },
  ];
  const result = routeType?.find((item) => item?.id == roleId)?.routes;
  return result(userRole);
};

export const getRoutes = (roleId, userRole) => {
  return ROLES_ROUTES(roleId, userRole);
};

//   return ROLES_ROUTES[role] ?? unauthorizedRoutes;
