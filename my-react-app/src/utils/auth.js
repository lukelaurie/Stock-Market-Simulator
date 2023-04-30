import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function isAuthenticated() {
  // make call to pai to see if authenitcated
  return true;
}

const PrivateRoutes = () => {
    let auth = {'token': true} 
    // if valided goes to page, if not to login
    return(
        auth.token ? <Outlet /> : <Navigate to="login"/>
    )
  }

export default PrivateRoutes;
