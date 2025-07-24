import { useEffect, useState } from "react";
import { Table, Card, Tag, Button, message } from "antd";
import { callCompleteOrder, callGetAllOrders } from "@/service/api";
import { CheckOutlined } from "@ant-design/icons";
import { getColor } from "@/utils/status.color";
import dayjs from "dayjs";

const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const fetchOrder = async () => {
    const res = await callGetAllOrders();
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const onComplete = async (id) => {
    const res = await callCompleteOrder(id);
    fetchOrder();
    message.success(res);
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "id", key: "orderId" },
    { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
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
      title: "Ngày đặt",
      dataIndex: "createAt",
      key: "createAt",
      render: (createAt) => <p>{dayjs(createAt).format("YYYY-MM-DD HH:mm")}</p>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalPrice),
    },
    {
      title: "Action",
      key: "action",
      render: (record) =>
        record.status === "PENDING" ? (
          <Button
            color="green"
            variant="solid"
            size="small"
            onClick={() => onComplete(record.id)}
          >
            <CheckOutlined />
          </Button>
        ) : null,
    },
  ];

  return (
    <Card title="Quản lý đơn hàng" style={{ margin: 24 }}>
      <Table
        dataSource={orders}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
    </Card>
  );
};

export default ManagerOrder;
