/**
 * This is what checks if the user has been logged in 
 * and if so it will allow thm into the page that 
 * they are trying to access.
 */

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function isAuthenticated() {
  return (
    fetch("http://157.230.181.102:8080/api/check/login", {
      credentials: "include",
    })
      .then((res) => res.text())
      // checks if user has been logged in
      .then((textResponce) => textResponce === "valid")
  );
}

const PrivateRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const loggedIn = await isAuthenticated();
      setIsLoggedIn(loggedIn);
      setIsLoading(false);
    }
    checkAuth();
  }, []);
  // only allows in after isAuthenticated has been executed
  if (isLoading) {
    return;
  }
  // allows into the page when a cookie/session exitsts
  return isLoggedIn ? <Outlet /> : <Navigate to="login" />;
};

export default PrivateRoutes;
