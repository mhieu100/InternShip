import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Image,
  Typography,
  Button,
  InputNumber,
  Space,
  Rate,
  Tag,
  message,
} from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import OrderModal from "../components/order.modal";
import "./style.css";
import { useSelector } from "react-redux";
import { callCreateOrder } from "../service/api";

const { Title, Text } = Typography;

const products = [
  {
    id: 1,
    name: "Cà phê phin truyền thống",
    price: 25000,
    image:
      "https://imgs.search.brave.com/kfXUG901bZqC4Y4HKb5eqCj2bEOZRioKwMixbDBe2Fs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/Y29mZmVlLXMtcmVh/ZHkuanBnP3dpZHRo/PTEwMDAmZm9ybWF0/PXBqcGcmZXhpZj0w/JmlwdGM9MA",
    description:
      "Hương vị đậm đà, chuẩn gu người Việt. Thích hợp cho những ai yêu thích sự mộc mạc và tinh tế.",
    rating: 4.8,
    category: "Cà phê truyền thống",
  },
  {
    id: 2,
    name: "Cà phê sữa đá",
    price: 29000,
    image:
      "https://imgs.search.brave.com/kfXUG901bZqC4Y4HKb5eqCj2bEOZRioKwMixbDBe2Fs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/Y29mZmVlLXMtcmVh/ZHkuanBnP3dpZHRo/PTEwMDAmZm9ybWF0/PXBqcGcmZXhpZj0w/JmlwdGM9MA",
    description:
      "Sự kết hợp hoàn hảo giữa vị cà phê đắng nhẹ và sữa đặc ngọt béo, tạo nên một thức uống kinh điển.",
    rating: 4.7,
    category: "Cà phê truyền thống",
  },
  {
    id: 3,
    name: "Bạc xỉu",
    price: 27000,
    image:
      "https://imgs.search.brave.com/kfXUG901bZqC4Y4HKb5eqCj2bEOZRioKwMixbDBe2Fs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/Y29mZmVlLXMtcmVh/ZHkuanBnP3dpZHRo/PTEwMDAmZm9ybWF0/PXBqcGcmZXhpZj0w/JmlwdGM9MA",
    description:
      "Dịu ngọt và thanh thoát hơn cà phê sữa, bạc xỉu là lựa chọn tuyệt vời cho những ai không quen vị đắng của cà phê.",
    rating: 4.6,
    category: "Cà phê truyền thống",
  },
  {
    id: 4,
    name: "Espresso",
    price: 35000,
    image:
      "https://imgs.search.brave.com/kfXUG901bZqC4Y4HKb5eqCj2bEOZRioKwMixbDBe2Fs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/Y29mZmVlLXMtcmVh/ZHkuanBnP3dpZHRo/PTEwMDAmZm9ybWF0/PXBqcGcmZXhpZj0w/JmlwdGM9MA",
    description:
      "Một shot cà phê đậm đặc, chiết xuất từ máy pha chuyên nghiệp, đánh thức mọi giác quan.",
    rating: 4.9,
    category: "Cà phê hiện đại",
  },
  {
    id: 5,
    name: "Cappuccino",
    price: 45000,
    image:
      "https://imgs.search.brave.com/kfXUG901bZqC4Y4HKb5eqCj2bEOZRioKwMixbDBe2Fs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/Y29mZmVlLXMtcmVh/ZHkuanBnP3dpZHRo/PTEwMDAmZm9ybWF0/PXBqcGcmZXhpZj0w/JmlwdGM9MA",
    description:
      "Sự hòa quyện giữa espresso, sữa nóng và lớp bọt sữa mềm mịn, lý tưởng cho một buổi sáng nhẹ nhàng.",
    rating: 4.7,
    category: "Cà phê hiện đại",
  },
  {
    id: 6,
    name: "Latte",
    price: 45000,
    image:
      "https://imgs.search.brave.com/kfXUG901bZqC4Y4HKb5eqCj2bEOZRioKwMixbDBe2Fs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/Y29mZmVlLXMtcmVh/ZHkuanBnP3dpZHRo/PTEwMDAmZm9ybWF0/PXBqcGcmZXhpZj0w/JmlwdGM9MA",
    description:
      "Đặc trưng bởi lớp bọt sữa mỏng và vị sữa chiếm ưu thế, mang lại cảm giác êm dịu và ngọt ngào.",
    rating: 4.6,
    category: "Cà phê hiện đại",
  },
];

const ListProduct = () => {
  const user = useSelector((state) => state.auth.user);

  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] = 1;
    });
    return initial;
  });

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(99, value)),
    }));
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setOrderModalOpen(true);
  };

  const handleOrder = async (orderInfo) => {
    if (!user.name) {
      message.error("Vui lòng đăng nhập để đặt hàng");
      return;
    }
    const order = {
      ...orderInfo,
      userId: user.id,
    };
    const res = await callCreateOrder(
      order.name,
      order.price,
      order.quantity,
      order.userId
    );
    if(res && res.statusCode === 201) {
      message.success("Đặt hàng thành công")
    }

    setOrderModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          padding: "40px 24px",
          background: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <Title
          level={2}
          style={{ textAlign: "center", marginBottom: 40, color: "#1a1a1a" }}
        >
          Discover Our Products
        </Title>
        <Row gutter={[24, 24]} style={{ maxWidth: 1200, margin: "0 auto" }}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div
                    style={{
                      position: "relative",
                      paddingTop: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      // preview={false}
                      className="product-image"
                    />
                    <Tag
                      color="blue"
                      style={{ position: "absolute", top: 10, right: 10 }}
                    >
                      {product.category}
                    </Tag>
                  </div>
                }
                actions={[
                  <Space>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleOrderClick(product)}
                      block
                    >
                      Order
                    </Button>
                    <Button icon={<HeartOutlined />} block>
                      Wishlist
                    </Button>
                  </Space>,
                ]}
              >
                <Card.Meta
                  title={
                    <Space
                      direction="vertical"
                      size={0}
                      style={{ width: "100%" }}
                    >
                      <Text strong style={{ fontSize: 16 }}>
                        {product.name}
                      </Text>
                      <Text type="danger" strong style={{ fontSize: 18 }}>
                        {product.price.toLocaleString()}₫
                      </Text>
                    </Space>
                  }
                  description={
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Text type="secondary">
                        {product.description.slice(0, 50) + ".."}
                      </Text>
                      <Rate
                        allowHalf
                        defaultValue={product.rating}
                        disabled
                        style={{ fontSize: 14 }}
                      />
                      <Space>
                        <Text>Quantity:</Text>
                        <InputNumber
                          min={1}
                          max={99}
                          value={quantities[product.id]}
                          onChange={(value) => handleChange(product.id, value)}
                          size="small"
                        />
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <OrderModal
        open={orderModalOpen}
        onCancel={() => setOrderModalOpen(false)}
        onOrder={handleOrder}
        product={selectedProduct}
        quantity={selectedProduct ? quantities[selectedProduct.id] : 1}
      />
    </>
  );
};

export default ListProduct;
