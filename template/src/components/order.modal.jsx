import React from "react";
import { Modal, Descriptions, Button } from "antd";

const OrderModal = ({ open, onCancel, onOrder, product, quantity }) => {
  if (!product) return null;

  const handleOrder = () => {
    onOrder({ name: product.name, price: product.price, quantity });
  };

  return (
    <Modal
      open={open}
      title={`Xác nhận đặt hàng`}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Tên sản phẩm">{product.name}</Descriptions.Item>
        <Descriptions.Item label="Đơn giá">{product.price.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Số lượng">{quantity}</Descriptions.Item>
        <Descriptions.Item label="Thành tiền">
          {(product.price * quantity).toLocaleString()}₫
        </Descriptions.Item>
      </Descriptions>
      <Button
        type="primary"
        block
        style={{ marginTop: 24 }}
        onClick={handleOrder}
      >
        Xác nhận đặt hàng
      </Button>
    </Modal>
  );
};

export default OrderModal;
