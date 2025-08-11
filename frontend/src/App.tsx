import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutApp from './components/layout/layout.app'
import LayoutClient from './components/layout/layout.client'
import NotFound from './components/share/not.found'
import LayoutAdmin from './components/layout/layout.admin'
import DashboardPage from 'pages/admin/dashboard'
import LoginPage from 'pages/auth/login'
import RegisterPage from 'pages/auth/register'
import HomePage from 'pages/client/home'
import Profile from 'pages/auth/profile'
import Products from 'pages/client/products'
import Chat from 'pages/client/chat'
import LayoutChat from 'components/layout/layout.chat'
import Cart from 'pages/client/cart'
import ProductDetail from 'pages/client/product.detail'
import Checkout from 'pages/client/checkout'
import ForgotPassword from 'pages/auth/forgot.password'
import VerifyCode from 'pages/auth/verify.code'
import ResetPassword from 'pages/auth/reset.password'
import Wishlist from 'pages/client/wishlist'
import ManagementUser from 'pages/admin/manager.user'
import ManagementPost from 'pages/admin/post/manager.post'
import EditorPost from 'pages/admin/post/editor.post'
import SettingSystem from 'pages/admin/setting.system'
import LiveHealth from 'pages/admin/camera/live.health'
import ManagementCamera from 'pages/admin/camera/manager.camera'
import SettingCamera from 'pages/admin/camera/setting.camera'
import { useAppDispatch } from 'redux/hook'
import { useEffect } from 'react'
import { fetchAccount } from 'redux/slices/authSlice'
import AuthRoute from 'components/share/auth-route'
import ProtectedRoute from './components/share/protected-route'

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      dispatch(fetchAccount())
    }
  }, [dispatch])

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'products', element: <Products /> },
        { path: 'product/:id', element: <ProductDetail /> },
        {
          path: 'profile',
          element: (
            <AuthRoute>
              <Profile />
            </AuthRoute>
          )
        },
        { path: 'cart', element: <Cart /> },
        { path: 'wishlist', element: <Wishlist /> },
        {
          path: 'checkout',
          element: (
            <AuthRoute>
              <Checkout />
            </AuthRoute>
          )
        }
      ]
    },
    {
      path: '/chat',
      element: (
        <LayoutApp>
          <LayoutChat />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <AuthRoute>
              <Chat />
            </AuthRoute>
          )
        }
      ]
    },
    {
      path: '/admin',
      element: (
        <LayoutApp>
          <ProtectedRoute>
            <LayoutAdmin />
          </ProtectedRoute>
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <DashboardPage />
        },
        {
          path: 'management-users',
          element: <ManagementUser />
        },
        {
          path: 'management-cameras',
          element: <ManagementCamera />
        },
        {
          path: 'live-health',
          element: <LiveHealth />
        },
        {
          path: 'camera-settings',
          element: <SettingCamera />
        },
        {
          path: 'management-posts',
          element: <ManagementPost />
        },
        {
          path: 'editor-post',
          element: <EditorPost />
        },
        {
          path: 'settings',
          element: <SettingSystem />
        }
      ]
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/verify-code',
      element: <VerifyCode />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
