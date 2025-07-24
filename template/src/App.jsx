import React, { useEffect } from "react";
import "antd/dist/reset.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LayoutApp from "./components/layout.app";
import ListProduct from "./pages/list.product";
import NotFoundPage from "./pages/error/not.found";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/protected.route";
import { callProfile } from "./service/api";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import ManagerOrder from "./pages/admin/manager.order";
import AccessDenied from "./components/access.denied";
import ChatPage from "./pages/chat";
import { message } from "antd";
import CameraControl from "./pages/camera";
import HomePage from "./pages/home";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      const getAcc = async () => {
        try {
          const res = await callProfile();
          if (res && res.statusCode === 200) {
            dispatch(setUser(res.data));
          }
        } catch (error) {
          message.error("Server disconnect !" + error);
        }
      };
      getAcc();
    }
  }, [dispatch, token]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutApp />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "products",
          element: <ListProduct />,
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "manager-orders",
          element: (
            <ProtectedRoute>
              <AccessDenied>
                <ManagerOrder />
              </AccessDenied>
            </ProtectedRoute>
          ),
        },
        {
          path: "chat",
          element: (
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          ),
        },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "camera",
          element: (
            <ProtectedRoute>
              <AccessDenied>
                <CameraControl />
              </AccessDenied>
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
