import { Outlet } from "react-router-dom";
import AppHeader from "@/components/layout/Header";
import BubbleChat from "@/components/features/BubbleChat";

const LayoutApp = () => {
  return (
    <>
      <AppHeader />
      <Outlet />
      <BubbleChat />
    </>
  );
};

export default LayoutApp;
