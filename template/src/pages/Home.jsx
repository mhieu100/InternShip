import { Button, Card, Col, Row, Typography, Space, Statistic } from "antd";
import {
  CameraOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const features = [
  {
    title: "Giám sát Thời gian thực",
    icon: (
      <VideoCameraOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
    ),
    description:
      "Xem trực tiếp camera từ mọi nơi với độ trễ thấp nhờ WebSocket",
  },
  {
    title: "Phủ sóng Toàn cầu",
    icon: <GlobalOutlined style={{ fontSize: "32px", color: "#52c41a" }} />,
    description: "Hệ thống camera trải rộng khắp các quốc gia và thành phố",
  },
  {
    title: "Bảo mật Cao cấp",
    icon: (
      <SafetyCertificateOutlined
        style={{ fontSize: "32px", color: "#faad14" }}
      />
    ),
    description: "Mã hóa end-to-end và kiểm soát truy cập chặt chẽ",
  },
  {
    title: "Đa dạng Người dùng",
    icon: <TeamOutlined style={{ fontSize: "32px", color: "#eb2f96" }} />,
    description: "Phân quyền linh hoạt: Admin, VIP User, Regular User",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
          background: "linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)",
          padding: "48px 24px",
          borderRadius: "16px",
          color: "white",
        }}
      >
        <Space direction="vertical" size="large">
          <CameraOutlined style={{ fontSize: "48px" }} />
          <Title level={1} style={{ color: "white", margin: 0 }}>
            Hệ thống Giám sát Camera Thông minh
          </Title>
          <Paragraph
            style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px" }}
          >
            Giải pháp giám sát toàn diện với công nghệ WebSocket và FFMPEG
          </Paragraph>
          <Button
            type="primary"
            size="large"
            ghost
            onClick={() => navigate("/public-camera")}
          >
            Xem Camera Ngay
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "48px" }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng Camera"
              value={1234}
              prefix={<CameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Quốc gia"
              value={25}
              prefix={<GlobalOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={5678}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Uptime"
              value={99.9}
              suffix="%"
              prefix={<CloudOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Title level={2} style={{ textAlign: "center", marginBottom: "32px" }}>
        Tính năng nổi bật
      </Title>
      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              style={{ height: "100%" }}
              hoverable
              cover={
                <div
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  {feature.icon}
                </div>
              }
            >
              <Card.Meta
                title={feature.title}
                description={feature.description}
                style={{ textAlign: "center" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={2} style={{ textAlign: "center", margin: "48px 0 32px" }}>
        Phân cấp người dùng
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Admin" extra={<SafetyCertificateOutlined />} hoverable>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Quản lý toàn bộ hệ thống</li>
              <li>Phân quyền người dùng</li>
              <li>Thêm/xóa/sửa camera</li>
              <li>Xem báo cáo & thống kê</li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Regular User" extra={<TeamOutlined />} hoverable>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Xem camera công cộng</li>
              <li>Thêm camera cá nhân</li>
              <li>Chức năng cơ bản</li>
              <li>Hỗ trợ chuẩn</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
