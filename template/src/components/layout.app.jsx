import { Outlet } from "react-router-dom";
import AppHeader from "./header";
import BubbleChat from "./chat/bubble.chat";

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
