import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutApp from './components/layout/layout.app'
import LayoutClient from './components/layout/layout.client'
import NotFound from './components/share/not.found'
import LayoutAdmin from './components/layout/layout.admin'
import DashboardPage from 'pages/admin/dashboard'
import LoginPage from 'pages/auth/login'
import RegisterPage from 'pages/auth/register'
import Profile from 'pages/auth/profile'
import Products from 'pages/client/ecommerce/products'
import Chat from 'pages/client/chat/chat'
import LayoutUnFooter from 'components/layout/layout.unfooter'
import Cart from 'pages/client/ecommerce/cart'
import ProductDetail from 'pages/client/ecommerce/product.detail'
import Checkout from 'pages/client/ecommerce/checkout'
import ForgotPassword from 'pages/auth/forgot.password'
import VerifyCode from 'pages/auth/verify.code'
import ResetPassword from 'pages/auth/reset.password'
import Wishlist from 'pages/client/ecommerce/wishlist'
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
import AnalysisShelf from 'pages/admin/analysis'
import PublicCamera from 'pages/client/camera/public.camera'
import CameraDetail from 'pages/client/camera/camera.detail'
import ChatWithAI from 'pages/client/chat/chat.ai'
// import Home from 'pages/client/ecommerce/home'
// import VaccineHome from 'pages/client/vaccine/home'
import ChatTest from 'pages/client/chat/chat.backup'
import HomeCamera from 'pages/client/camera/home'
import PageDemo from 'pages/client/text'

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
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
        // { index: true, element: <Home /> },
        { index: true, element: <HomeCamera /> },
        // { index: true, element: <VaccineHome /> },
        { path: 'demo', element: <PageDemo /> },
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
      path: '/cameras',
      element: (
        <LayoutApp>
          <LayoutUnFooter />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <PublicCamera />
        },
        {
          path: ':id',
          element: <CameraDetail />
        }
      ]
    },

    {
      path: '/chat',
      element: (
        <LayoutApp>
          <LayoutUnFooter />
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
        },
        {
          path: 'test',
          element: (
            <AuthRoute>
              <ChatTest />
            </AuthRoute>
          )
        },
        {
          path: 'ai',
          element: (
            <AuthRoute>
              <ChatWithAI />
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
          path: 'analysis',
          element: <AnalysisShelf />
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
