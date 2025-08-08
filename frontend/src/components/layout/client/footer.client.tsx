import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: 16 }}>
              ShopHub
            </Title>
            <Text style={{ color: '#9ca3af', display: 'block', marginBottom: 16 }}>
              Your one-stop destination for quality products at amazing prices. 
              Shop with confidence and enjoy fast, reliable delivery.
            </Text>
            <Space size="large">
              <div className="text-xl text-gray-400 cursor-pointer transition-colors duration-300 hover:text-blue-500">
                <FacebookOutlined />
              </div>
              <div className="text-xl text-gray-400 cursor-pointer transition-colors duration-300 hover:text-blue-500">
                <TwitterOutlined />
              </div>
              <div className="text-xl text-gray-400 cursor-pointer transition-colors duration-300 hover:text-blue-500">
                <InstagramOutlined />
              </div>
              <div className="text-xl text-gray-400 cursor-pointer transition-colors duration-300 hover:text-blue-500">
                <LinkedinOutlined />
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
              Quick Links
            </Title>
            <Space direction="vertical" size="small">
              <Link href="/products" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">All Products</Link>
              <Link href="/categories" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Categories</Link>
              <Link href="/deals" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Special Deals</Link>
              <Link href="/new-arrivals" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">New Arrivals</Link>
              <Link href="/bestsellers" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Best Sellers</Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
              Customer Service
            </Title>
            <Space direction="vertical" size="small">
              <Link href="/help" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Help Center</Link>
              <Link href="/shipping" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Shipping Info</Link>
              <Link href="/returns" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Returns & Exchanges</Link>
              <Link href="/size-guide" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Size Guide</Link>
              <Link href="/contact" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Contact Us</Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
              Contact Info
            </Title>
            <Space direction="vertical" size="small">
              <Space>
                <EnvironmentOutlined style={{ color: '#3b82f6' }} />
                <Text style={{ color: '#9ca3af' }}>
                  123 Commerce St, City, State 12345
                </Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#3b82f6' }} />
                <Text style={{ color: '#9ca3af' }}>
                  +1 (555) 123-4567
                </Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#3b82f6' }} />
                <Text style={{ color: '#9ca3af' }}>
                  support@shophub.com
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#374151', margin: '32px 0 24px' }} />

        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <Text style={{ color: '#9ca3af' }}>
              © {currentYear} ShopHub. All rights reserved.
            </Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space split={<span style={{ color: '#374151' }}>|</span>}>
              <Link href="/privacy" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-500 transition-colors duration-300 no-underline">Cookie Policy</Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;