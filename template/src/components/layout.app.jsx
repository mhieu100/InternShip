import React from "react";
import AppHeader from "./Header";
import { Outlet } from "react-router-dom";

const LayoutApp = () => {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};

export default LayoutApp;
