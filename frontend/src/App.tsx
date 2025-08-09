import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutApp from "./components/layout/layout.app";
import LayoutClient from "./components/layout/layout.client";
import NotFound from "./components/share/not.found";
import LayoutAdmin from "./components/layout/layout.admin";
import ProtectedRoute from "./components/share/protected-route";
import DashboardPage from "pages/admin/dashboard";
import LoginPage from "pages/auth/login";
import RegisterPage from "pages/auth/register";
import HomePage from "pages/client/home";
import Profile from "pages/auth/profile";
import Products from "pages/client/products";
import Chat from "pages/client/chat";
import LayoutChat from "components/layout/layout.chat";
import Cart from "pages/client/cart";
import ProductDetail from "pages/client/product.detail";
import Checkout from "pages/client/checkout";
import ForgotPassword from "pages/auth/forgot.password";
import VerifyCode from "pages/auth/verify.code";
import ResetPassword from "pages/auth/reset.password";
import Wishlist from "pages/client/wishlist";
import ManagementUser from "pages/admin/manager.user";
import ManagementPost from "pages/admin/post/manager.post";
import EditorPost from "pages/admin/post/editor.post";
import SettingSystem from "pages/admin/setting.system";
import LiveHealth from "pages/admin/camera/live.health";
import ManagementCamera from "pages/admin/camera/manager.camera";
import SettingCamera from "pages/admin/camera/setting.camera";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'products', element: <Products /> },
        { path: 'product/:id', element: <ProductDetail /> },
        { path: "profile", element: <Profile /> },
        { path: "cart", element: <Cart /> },
        { path: "wishlist", element: <Wishlist /> },
        { path: "checkout", element: <Checkout /> }
      ],
    },
    {
      path: "/chat",
      element: (<LayoutApp><LayoutChat /></LayoutApp>),
      errorElement: <NotFound />,
      children: [

        { index: true, element: <Chat /> }
      ],
    },
    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "management-users",
          element: (
            <ProtectedRoute>
              <ManagementUser />
            </ProtectedRoute>
          )
        },
        {
          path: "management-cameras",
          element: (
            <ProtectedRoute>
              <ManagementCamera />
            </ProtectedRoute>
          )
        },
        {
          path: "live-health",
          element: (
            <ProtectedRoute>
              <LiveHealth />
            </ProtectedRoute>
          )
        },
        {
          path: "camera-settings",
          element: (
            <ProtectedRoute>
              <SettingCamera />
            </ProtectedRoute>
          )
        },
        {
          path: "management-posts",
          element: (
            <ProtectedRoute>
              <ManagementPost />
            </ProtectedRoute>
          )
        },
        {
          path: "editor-post",
          element: (
            <ProtectedRoute>
              <EditorPost />
            </ProtectedRoute>
          )
        },
        {
          path: "settings",
          element: (
            <ProtectedRoute>
              <SettingSystem />
            </ProtectedRoute>
          )
        }
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/verify-code",
      element: <VerifyCode />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App