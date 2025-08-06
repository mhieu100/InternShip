import { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Drawer,
  Grid,
  Button,
  Space,
  message,
} from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { callLogout } from "@/services/api";

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

const navItems = [
  {
    key: "/",
    label: <NavLink to="/">Trang chủ</NavLink>,
  },
  {
    key: "/manager-camera",
    label: <NavLink to="/manager-camera">Quản lý camera (Admin)</NavLink>,
  },
  {
    key: "/public-camera",
    label: <NavLink to="/public-camera">Camera công cộng</NavLink>,
  },
  {
    key: "/chat",
    label: <NavLink to="/chat">Chat</NavLink>,
  },
];

const AppHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.isAuthentication);

  const [drawerOpen, setDrawerOpen] = useState(false);



  const getSelectedKey = () => {
    const path = location.pathname;
    if (navItems.some((item) => item.key === path)) {
      return path;
    }
    const parentPath = navItems.find(
      (item) => path.startsWith(item.key) && item.key !== "/"
    )?.key;
    if (parentPath) {
      return parentPath;
    }
    return path === "/" ? "/" : "";
  };

  const handeLogout = async () => {
    await callLogout();
    dispatch(logout());
    message.success("Đăng xuất thành công");
    navigate("/");
  };

  const userMenu = [
    {
      key: "profile",
      label: <Link to="/profile">Hello, {user?.name?.toUpperCase()}</Link>,
    },
    ...(user && user.role === "ADMIN"
      ? [
        {
          key: "manager-camera",
          label: <Link to="/manager-camera">Quản lý camera</Link>,
        },
      ]
      : []),

    {
      key: "logout",
      label: "Logout",
      danger: true,
      onClick: handeLogout,
    },
  ];

  const menuComponent = (
    <Menu
      mode={isMobile ? "vertical" : "horizontal"}
      items={navItems}
      style={isMobile ? { border: "none" } : { flex: 1, minWidth: 0 }}
      selectedKeys={[getSelectedKey()]}
      theme="light"
    />
  );

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px #f0f1f2",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {isMobile && (
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
          onClick={() => setDrawerOpen(true)}
          style={{ marginRight: 16 }}
        />
      )}
      <div
        style={{
          fontWeight: "bold",
          fontSize: 22,
          flex: 1,
          color: "#fa541c",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Camera Health Check</span>
      </div>
      {!isMobile && menuComponent}
      {isAuth ? (
        <Dropdown
          menu={{ items: userMenu }}
          placement="bottomRight"
          trigger={["hover"]}
        >
          <Avatar
            style={{
              backgroundColor: "#fa541c",
              cursor: "pointer",
              marginLeft: 16,
            }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      ) : (
        <Space>
          <Link style={{ fontSize: 14 }} to="/login">
            Login
          </Link>
          <Link style={{ fontSize: 14 }} to="/register">
            Register
          </Link>
        </Space>
      )}

      <Drawer
        title={
          <span
            style={{
              color: "#fa541c",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            Camera Health Check
          </span>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        style={{ padding: 0 }}
      >
        {menuComponent}
      </Drawer>
    </AntHeader>
  );
};

export default AppHeader;
