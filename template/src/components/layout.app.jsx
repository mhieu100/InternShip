import { Outlet } from "react-router-dom";
import AppHeader from "./header";

const LayoutApp = () => {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};

export default LayoutApp;
