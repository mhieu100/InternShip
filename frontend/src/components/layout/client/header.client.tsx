import React, { useState } from 'react'
import {
  Layout,
  Menu,
  Badge,
  Avatar,
  Dropdown,
  Button,
  Drawer,
  type MenuProps,
  message
} from 'antd'
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  MenuOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from 'redux/hook'
import { setLogout } from 'redux/slices/authSlice'
import { callLogout } from 'services/auth.api'

const { Header: AntHeader } = Layout

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { itemCount } = useAppSelector((state) => state.cart)
  const { isAuthenticated, user } = useAppSelector((state) => state.account)

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const menuItems: MenuProps['items'] = [
    { key: '/', label: 'Home' },
    { key: '/products', label: 'Products' },
    { key: '/chat', label: 'Chat' }
  ]

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: 'Profile' },
    {
      key: 'admin',
      label: 'ADMIN',
      disabled: user?.role !== 'ADMIN'
    },
    { key: 'orders', label: 'My Orders' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'settings', label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', label: 'Logout' }
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  const handleUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      await callLogout()

      dispatch(setLogout())
      navigate('/')
      message.success('Logged out successfully!')
    } else {
      navigate(`/${key}`)
    }
  }

  const handleMobileMenuClose = () => {
    setMobileMenuVisible(false)
  }

  const handleMobileMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
    setMobileMenuVisible(false)
  }

  const handleMobileUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      await callLogout()

      dispatch(setLogout())
      navigate('/')
      message.success('Logged out successfully!')
    } else {
      navigate(`/${key}`)
    }
    setMobileMenuVisible(false)
  }

  return (
    <>
      <AntHeader className="bg-white shadow-sm sticky top-0 z-50 px-6 md:px-4">
        <div className="flex items-center justify-between h-full max-w-6xl mx-auto gap-2 md:gap-0">
          <div
            className="text-xl md:text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate('/')}
          >
            ShopHub
          </div>

          {/* Search input removed */}

          <div className="flex items-center gap-3 md:gap-6">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ border: 'none', background: 'transparent' }}
              className="hidden md:flex"
            />

            {/* Mobile search button removed */}

            <Button
              icon={<HeartOutlined />}
              size="large"
              onClick={() => navigate('/wishlist')}
              className="hidden sm:flex border-none shadow-none hover:bg-slate-100"
            />

            <Badge count={itemCount} size="small">
              <Button
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={() => navigate('/cart')}
                className="border-none shadow-none hover:bg-slate-100"
              />
            </Badge>

            {isAuthenticated ? (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
                className="hidden md:block"
              >
                <Avatar
                  src={
                    user?.avatar ||
                    'https://imgs.search.brave.com/kRzOEK2P26KHgRlY94E5DGE517Q4IJTULPg_lFWXLSU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHlw/aXguY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzEwL2Fu/aW1lLWF2YXRhci1w/cm9maWxlLXBpY3R1/cmUtdGh5cGl4LTI0/LTcwMHg3MDAuanBn'
                  }
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                />
              </Dropdown>
            ) : (
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                className="hidden md:block bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Button>
            )}

            <Button
              icon={<MenuOutlined />}
              size="large"
              className="flex md:hidden border-none shadow-none hover:bg-slate-100"
              onClick={() => setMobileMenuVisible(true)}
            />
          </div>
        </div>
      </AntHeader>

      {/* Mobile Search Drawer removed */}

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={handleMobileMenuClose}
        open={mobileMenuVisible}
        width={280}
        className="md:hidden"
      >
        <div>
          {/* User Section */}
          <div className="p-4 border-b border-gray-200 mb-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={
                    user?.avatar ||
                    'https://imgs.search.brave.com/kRzOEK2P26KHgRlY94E5DGE517Q4IJTULPg_lFWXLSU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHlw/aXguY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzEwL2Fu/aW1lLWF2YXRhci1w/cm9maWxlLXBpY3R1/cmUtdGh5cGl4LTI0/LTcwMHg3MDAuanBn'
                  }
                  icon={<UserOutlined />}
                  size="large"
                />
                <div>
                  <div className="font-medium">{user?.name || 'User'}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    navigate('/login')
                    setMobileMenuVisible(false)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Login
                </Button>
                <Button
                  block
                  onClick={() => {
                    navigate('/register')
                    setMobileMenuVisible(false)
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMobileMenuItemClick}
            className="border-none"
          />

          {/* User Menu Items (if authenticated) */}
          {isAuthenticated && (
            <>
              <div className="my-4 border-t border-gray-200" />
              <Menu
                mode="vertical"
                items={userMenuItems}
                onClick={handleMobileUserMenuClick}
                className="border-none"
              />
            </>
          )}

          {/* Additional Mobile Actions */}
          <div className="my-4 border-t border-gray-200 pt-4">
            <Button
              block
              icon={<HeartOutlined />}
              onClick={() => {
                navigate('/wishlist')
                setMobileMenuVisible(false)
              }}
              className="mb-2"
            >
              Wishlist
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Header
