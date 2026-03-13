import { lazy } from 'react';
import { Outlet } from "react-router-dom";

const employeeRoutes = [
  {
    path: "/",
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        element: <h1>Hello World (Employee)</h1>,
      },
      {
        path: "*",
        element: <h1>404</h1>,
      },
    ],
  },
];

export default employeeRoutes