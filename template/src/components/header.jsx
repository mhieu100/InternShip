import React, { useState } from "react";
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
import {
  UserOutlined,
  MenuOutlined,
  AppstoreOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { callLogout } from "../service/api";

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

const productsMenu = [
  {
    key: "all-products",
    label: <Link to="/">Tất cả sản phẩm</Link>,
  },
  {
    key: "feature-product",
    label: <Link to="/">Sản phẩm nổi bật</Link>,
  },
];

const navItems = [
  {
    key: "home",
    label: <NavLink to="/">Trang chủ</NavLink>,
  },
  {
    key: "products",
    label: (
      <Dropdown menu={{ items: productsMenu }} placement="bottom">
        <span style={{ cursor: "pointer" }}>Sản phẩm</span>
      </Dropdown>
    ),
  },
  {
    key: "orders",
    label: <NavLink to="/manager-orders">Quản lý đơn hàng</NavLink>,
  },
];

const AppHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.isAuthentication);

  const handeLogout = async () => {
    await callLogout();
    dispatch(logout());

    message.success("Đăng xuất thành công");
    navigate("/");
  };

  const userMenu = [
    ...(user && user.role === "ADMIN"
      ? [
          {
            key: "orders",
            label: <Link to="/manager-orders">Quản lý đơn hàng</Link>,
          },
        ]
      : []),
    {
      key: "profile",
      label: <Link to="/profile">Hello, {user?.name?.toUpperCase()}</Link>,
    },
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
      selectable={false}
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
        <span>GoShop</span>
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
            <img
              src="https://ant.design/assets/logo.1ef800a8.svg"
              alt="Logo"
              style={{ height: 28, marginRight: 8 }}
            />
            GoShop
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
