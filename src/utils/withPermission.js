import React from "react";
import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

const withPermissions = (WrappedComponent, permissionLevel) => {
  const Wrapper = (props) => {
    // const { user } = useAuth();
    const user = { permissionLevel: [1, 2, 3] };
    if (!user) {
      // if the user is not authenticated, redirect to the login page
      return <Navigate to="/login" />;
    }

    if (!user.permissionLevel.includes(permissionLevel)) {
      // if the user's permission level doesn't match any of the allowed permission levels,
      // redirect to the home page or show an access denied message
      //   return <Navigate to="/" />;
      // or 
      return <div>Access denied</div>;
    }

    // render the wrapped component
    return <WrappedComponent {...props} access={{add:true,del:true,edit:true}}/>;
  };

  return Wrapper;
};

export default withPermissions;
