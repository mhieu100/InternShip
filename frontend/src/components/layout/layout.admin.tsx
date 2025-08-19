import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { message, Select, Switch, theme } from 'antd'
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  SettingOutlined,
  FileTextOutlined,
  CameraOutlined
} from '@ant-design/icons'
import { Avatar, Dropdown, ConfigProvider } from 'antd'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { ProLayout } from '@ant-design/pro-components'
import { callLogout } from 'services/auth.api'
import { setLogout } from 'redux/slices/authSlice'

const LayoutAdmin = () => {
  const { token } = theme.useToken()
  const dispatch = useAppDispatch()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  const { user } = useAppSelector((state) => state.account)
  const navigate = useNavigate()
  const location = useLocation()

  // Xử lý theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Xử lý ngôn ngữ
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>Profile</span>
        </div>
      ),
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      label: (
        <div className="flex items-center gap-2">
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      ),
      danger: true,
      onClick: async () => {
        await callLogout()
        dispatch(setLogout())
        navigate('/')
        message.success('Logged out successfully!')
      }
    }
  ]

  const menuItems = [
    {
      key: '/admin',
      path: '/admin',
      icon: <DashboardOutlined />,
      name: 'Dashboard'
    },
    {
      key: '/admin/management-users',
      path: '/admin/management-users',
      icon: <TeamOutlined />,
      name: 'Users'
    },
    {
      key: '/admin/cameras',
      icon: <CameraOutlined />,
      name: 'Cameras',
      children: [
        {
          key: '/admin/management-cameras',
          path: '/admin/management-cameras',
          name: 'Manage'
        },
        {
          key: '/admin/analysis',
          path: '/admin/analysis',
          name: 'Analysis'
        },
        {
          key: '/admin/camera-settings',
          path: '/admin/camera-settings',
          name: 'Settings'
        }
      ]
    },
    {
      key: '/admin/posts',
      icon: <FileTextOutlined />,
      name: 'Posts',
      children: [
        {
          key: '/admin/management-posts',
          path: '/admin/management-posts',
          name: 'Manage'
        },
        {
          key: '/admin/editor-post',
          path: '/admin/editor-post',
          name: 'Edit'
        }
      ]
    },
    {
      key: '/admin/settings',
      path: '/admin/settings',
      icon: <SettingOutlined />,
      name: 'Settings'
    }
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <ProLayout
        fixSiderbar
        fixedHeader
        defaultCollapsed
        title="CMS Dashboard"
        pageTitleRender={false}
        token={{
          sider: {
            colorMenuBackground: isDarkMode ? '#141414' : '#fff',
            colorMenuItemDivider: isDarkMode ? '#424242' : '#f0f0f0',
            colorTextMenu: isDarkMode
              ? 'rgba(255, 255, 255, 0.85)'
              : 'rgba(0, 0, 0, 0.88)',
            colorTextMenuSelected: token.colorPrimary,
            colorTextMenuActive: token.colorPrimary,
            colorBgMenuItemSelected: isDarkMode ? '#1f1f1f' : '#e6f4ff'
          },
          header: {
            colorBgHeader: isDarkMode ? '#1f1f1f' : '#fff',
            colorHeaderTitle: isDarkMode ? '#fff' : '#000'
          }
        }}
        actionsRender={() => [
          <div key="lang-select" style={{ padding: '0 8px', borderRadius: 4 }}>
            <Select
              size="small"
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'en', label: 'English' },
                { value: 'vi', label: 'Tiếng Việt' }
              ]}
              className="w-[100px]"
              style={{
                backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
                color: isDarkMode ? '#fff' : '#000'
              }}
            />
          </div>,
          <div key="theme-switch" style={{ padding: '0 8px', borderRadius: 4 }}>
            <Switch
              size="small"
              checked={isDarkMode}
              onChange={setIsDarkMode}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
              style={{
                backgroundColor: isDarkMode ? token.colorPrimary : undefined
              }}
            />
          </div>,
          <div
            key="user-dropdown"
            style={{
              padding: '0 4px',
              borderRadius: 4
            }}
          >
            <Dropdown
              menu={{
                items: userMenuItems,
                style: {
                  backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
                  color: isDarkMode ? '#fff' : '#000'
                }
              }}
              overlayStyle={{
                minWidth: '160px'
              }}
              trigger={['click']}
            >
              <div className="flex h-full items-center">
                <span className="inline-flex items-center gap-2 px-2 py-0">
                  <Avatar
                    size="small"
                    icon={
                      <UserOutlined
                        style={{ color: isDarkMode ? '#fff' : undefined }}
                      />
                    }
                    style={{
                      backgroundColor: isDarkMode ? '#1f1f1f' : undefined,
                      border: isDarkMode ? '1px solid #424242' : undefined
                    }}
                  />
                  <span style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {user?.name || 'Guest'}
                  </span>
                </span>
              </div>
            </Dropdown>
          </div>
        ]}
        menuDataRender={() => menuItems}
        menuItemRender={(item, dom) =>
          item.path ? <Link to={item.path}>{dom}</Link> : <>{dom}</>
        }
        subMenuItemRender={(item, dom) => (
          <div onClick={() => item.path && navigate(item.path)}>{dom}</div>
        )}
        layout="mix"
        location={location}
        selectedKeys={[location.pathname]}
        style={{
          background: isDarkMode ? '#141414' : '#f5f5f5'
        }}
      >
        <Outlet />
      </ProLayout>
    </ConfigProvider>
  )
}

export default LayoutAdmin
