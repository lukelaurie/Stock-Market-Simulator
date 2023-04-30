import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";


function isAuthenticated() {
  return (
    fetch("http://localhost/api/check/login")
      .then((res) => res.text())
      // checks if user has been logged in
      .then((textResponce) => textResponce === "invalid")
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
