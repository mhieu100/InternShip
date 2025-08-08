import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  FileTextOutlined,
  EditFilled,
  BulbOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Menu, Layout, Button, Switch, ConfigProvider, theme } from 'antd';
import { useAppSelector } from "store/hook";


const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {

  const { isAuthenticated, userInfo } = useAppSelector(state => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  // Load theme preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDarkMode(true);
  }, []);

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };


  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true
    },
  ];

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/management-users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
    {
      key: '/admin/management-posts',
      icon: <FileTextOutlined />,
      label: 'Posts',
      children: [
        {
          key: '/admin/management-posts',
          icon: <FileTextOutlined />,
          label: 'Manage Posts',
        },
        {
          key: '/admin/editor-post',
          icon: <EditFilled />,
          label: 'Edit Post',
        },
      ],
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    }
  ];


  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          theme={isDarkMode ? 'dark' : 'light'}
          style={{
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            zIndex: 10
          }}
        >
          <div className="p-4 h-16 flex items-center">
            <div className="flex items-center gap-2">
              <SafetyCertificateOutlined className="text-xl text-blue-500" />
              {!collapsed && <span className="text-lg font-bold text-gray-900">VaxChain</span>}
            </div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
          <Header className="p-0 px-6 flex items-center justify-between"
            style={{
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
              height: 64,
              background: 'var(--ant-color-bg-container)'
            }}>
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              className="text-lg"
            />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BulbOutlined />
                <Switch
                  checked={isDarkMode}
                  onChange={(checked) => setIsDarkMode(checked)}
                  size="small"
                />
              </div>
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
                trigger={['click']}
              >
                <div className="cursor-pointer flex items-center gap-2">
                  <Badge dot={isAuthenticated}>
                    <Avatar src={userInfo?.avatar} className="bg-blue-500">
                      {userInfo?.name?.charAt(0) || <UserOutlined />}
                    </Avatar>
                  </Badge>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{userInfo?.name}</div>
                  </div>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{
              margin: 20,
              padding: 20,
              background: 'var(--ant-color-bg-container)',
              borderRadius: 8,
              height: 'calc(100vh - 64px - 40px)',
              overflow: 'auto'
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default LayoutAdmin