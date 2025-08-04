import { useEffect } from "react";
import "antd/dist/reset.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import HomePage from "@/pages/Home";
import Profile from "@/pages/Profile";
import ChatPage from "@/pages/chat";
import PublicCamera from "@/pages/camera/PublicCamera";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccessDenied from "@/components/auth/AccessDenied";

import CameraControl from "@/pages/admin/manager.camera";

import NotFoundPage from "@/pages/error/not.found";

import { useAuth } from "@/hooks/useAuth";
import CameraDetail from "./pages/camera/CameraDetail";

function App() {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },

        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
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
          path: "public-camera",
          element: (
          <ProtectedRoute>
            <PublicCamera />
          </ProtectedRoute>
          ),
        },
        {
          path: "manager-camera",
          element: (
            <ProtectedRoute>
              <AccessDenied>
                <CameraControl />
              </AccessDenied>
            </ProtectedRoute>
          ),
        },
        {
          path: "camera/:id",
          element: <CameraDetail />,
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;