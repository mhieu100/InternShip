import { Button, Card, Descriptions, Table, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import { callGetOrderOfMe } from "../service/api";
import { useEffect, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { getColor } from "../utils/status.color";

const { Title } = Typography;

const columns = [
  { title: "Mã đơn", dataIndex: "id", key: "orderId" },
  { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (price) => (
      <span>
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(price))}
      </span>
    ),
  },
  { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
  {
    title: "Khách hàng",
    dataIndex: "user",
    key: "user",
    render: (user) => {
      return <p>{user?.name?.toUpperCase()}</p>;
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => <Tag color={getColor(status)}>{status}</Tag>,
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (totalPrice) => (
      <span>
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(totalPrice))}
      </span>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Button color="danger" variant="solid" size="small">
        <CloseOutlined />
      </Button>
    ),
  },
];

const Profile = () => {
 

  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);
  const fetchOrder = async () => {
    const res = await callGetOrderOfMe();
    setOrders(res.data);
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div style={{ maxWidth: 950, margin: "auto", marginTop: 64 }}>
      <Card title="Thông tin cá nhân" style={{ marginBottom: 32 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{user.role}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Đơn hàng của tôi
        </Title>
        <Table
          columns={columns}
          dataSource={orders}
          pagination={false}
          rowKey="id"
        />
      </Card>
    </div>
  );
};
export default Profile;
