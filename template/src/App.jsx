import React, { useEffect } from "react";
import "antd/dist/reset.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { message } from "antd";

// Layout Components
import AppLayout from "@/components/layout/AppLayout";

// Page Components
import HomePage from "@/pages/Home";
import ListProduct from "@/pages/list.product";
import Profile from "@/pages/Profile";
import ChatPage from "@/pages/chat";
import PublicCamera from "@/pages/camera/PublicCamera";

// Auth Components
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccessDenied from "@/components/auth/AccessDenied";

// Admin Components
import ManagerOrder from "@/pages/admin/manager.order";
import CameraControl from "@/pages/admin/manager.camera";

// Error Components
import NotFoundPage from "@/pages/error/not.found";

// Hooks and Services
import { useAuth } from "@/hooks/useAuth";
import CameraGrid from "./pages/camera/CameraGrid";

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
          path: "public-camera",
          element: <PublicCamera />,
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
          path: "camera-grid",
          element: <CameraGrid />,
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;