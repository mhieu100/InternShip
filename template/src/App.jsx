import React, { useEffect } from "react";
import "antd/dist/reset.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LayoutApp from "./components/layout.app";
import ListProduct from "./pages/list.product";
import NotFoundPage from "./pages/error/not.found";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/protected.route";
import { callProfile } from "./service/api";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import ManagerOrder from "./pages/manager.order";
import AccessDenied from "./components/access.denied";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");
  const getAcc = async () => {
    const res = await callProfile();
    if(res && res.statusCode === 200) {
      dispatch(setUser(res.data));
    }
  };

  useEffect(() => {
    if (!!token) {
      getAcc();
    }
  }, [token]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutApp />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <ListProduct /> },
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
            <AccessDenied>
              <ManagerOrder />
            </AccessDenied>
          ),
        },
     
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  );
}

export default App;
