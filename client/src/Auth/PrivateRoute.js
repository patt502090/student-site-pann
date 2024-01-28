// PrivateRoute.js
import React, { useState, useEffect } from "react";
import {  Navigate } from "react-router-dom";
import axios from "axios";
import HomeS from "../web_page/homeS";
import conf from "../conf/main";

const PrivateRoute = ({ roles }) => {
  const [state, setState] = useState({
    isLoggedIn: false,
    user: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('auth.jwt');
        const response = await axios.get(`${conf.apiUrlPrefix}${conf.jwtUserRoleEndpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setState({
          isLoggedIn: true,
          user,
        });
      } catch (error) {
        setState({
          isLoggedIn: false,
          user: null,
        });
      }
    };

    fetchUserData();
  }, []);

  if (state.isLoggedIn && state.user && state.user.role) {
    const isAuthorized = roles.includes(state.user.role.name);

    if (isAuthorized) {
      return <HomeS />;
    } else {
      return <Navigate to="/student" replace={true} />;
    }
  }

  return <div>Loading...</div>;
};

export default PrivateRoute;
