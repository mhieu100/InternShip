import React, { useState } from 'react'
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Carousel,
  Badge,
  Tag,
  Statistic,
  Steps,
  Space,
  Input,
  Select,
  DatePicker,
  Form,
  Modal,
  notification
} from 'antd'
import {
  CalendarOutlined,
  MedicineBoxOutlined,
  SafetyOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  HeartOutlined,
  TeamOutlined,
  GlobalOutlined,
  RightOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import vaccineData from '../../../mock/vaccine.json'

const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { Step } = Steps

const VaccineHome = () => {
  const navigate = useNavigate()
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null)
  const [bookingModalVisible, setBookingModalVisible] = useState(false)
  const [form] = Form.useForm()

  const vaccines = vaccineData.vaccines || []
  const featuredVaccines = vaccines.slice(0, 6)
  const popularVaccines = vaccines.slice(0, 4)

  // Hero banner slides
  const bannerSlides = [
    {
      id: 1,
      title: 'Bảo Vệ Sức Khỏe Gia Đình',
      subtitle: 'Tiêm chủng an toàn & hiệu quả',
      description:
        'Đặt lịch tiêm chủng dễ dàng với các loại vắc xin chất lượng cao từ các nhà sản xuất uy tín',
      buttonText: 'Đặt Lịch Ngay',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=500&fit=crop&auto=format',
      badge: 'AN TOÀN'
    },
    {
      id: 2,
      title: 'Vắc Xin Chất Lượng Cao',
      subtitle: 'Nhập khẩu chính hãng',
      description:
        'Tất cả vắc xin đều được nhập khẩu từ các nhà sản xuất uy tín trên thế giới',
      buttonText: 'Xem Danh Sách',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      image:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=500&fit=crop&auto=format',
      badge: 'CHÍNH HÃNG'
    },
    {
      id: 3,
      title: 'Dịch Vụ Chuyên Nghiệp',
      subtitle: 'Đội ngũ y tế giàu kinh nghiệm',
      description:
        'Được thực hiện bởi đội ngũ y bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm',
      buttonText: 'Tìm Hiểu Thêm',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      image:
        'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&h=500&fit=crop&auto=format',
      badge: 'CHUYÊN NGHIỆP'
    }
  ]

  // Vaccine categories
  const categories = [
    {
      id: 1,
      name: 'Trẻ Em',
      icon: <UserOutlined />,
      count: vaccines.filter((v) => v.category.includes('Trẻ em')).length,
      color: '#52c41a',
      description: 'Vắc xin dành cho trẻ em từ sơ sinh đến 18 tuổi'
    },
    {
      id: 2,
      name: 'Người Lớn',
      icon: <TeamOutlined />,
      count: vaccines.filter((v) => v.category.includes('Người lớn')).length,
      color: '#1890ff',
      description: 'Vắc xin phòng ngừa bệnh cho người trưởng thành'
    },
    {
      id: 3,
      name: 'Du Lịch',
      icon: <GlobalOutlined />,
      count: vaccines.filter((v) => v.category.includes('Du lịch')).length,
      color: '#722ed1',
      description: 'Vắc xin cần thiết khi đi du lịch nước ngoài'
    },
    {
      id: 4,
      name: 'Phụ Nữ',
      icon: <HeartOutlined />,
      count: vaccines.filter((v) => v.category.includes('Phụ nữ')).length,
      color: '#eb2f96',
      description: 'Vắc xin dành riêng cho phụ nữ và thai phụ'
    }
  ]

  // Booking process steps
  const bookingSteps = [
    {
      title: 'Chọn Vắc Xin',
      description: 'Lựa chọn loại vắc xin phù hợp',
      icon: <MedicineBoxOutlined />
    },
    {
      title: 'Đặt Lịch Hẹn',
      description: 'Chọn ngày giờ tiêm chủng',
      icon: <CalendarOutlined />
    },
    {
      title: 'Xác Nhận',
      description: 'Xác nhận thông tin và thanh toán',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'Tiêm Chủng',
      description: 'Đến cơ sở y tế để tiêm',
      icon: <SafetyOutlined />
    }
  ]

  // Statistics
  const stats = [
    {
      title: 'Khách Hàng Tin Tưởng',
      value: 50000,
      suffix: '+',
      prefix: <UserOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: 'Loại Vắc Xin',
      value: vaccines.length,
      suffix: '+',
      prefix: <MedicineBoxOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: 'Năm Kinh Nghiệm',
      value: 15,
      suffix: '+',
      prefix: <StarOutlined style={{ color: '#faad14' }} />
    },
    {
      title: 'Cơ Sở Y Tế',
      value: 25,
      suffix: '+',
      prefix: <EnvironmentOutlined style={{ color: '#722ed1' }} />
    }
  ]

  const handleBooking = (vaccine: any) => {
    setSelectedVaccine(vaccine)
    setBookingModalVisible(true)
  }

  const handleBookingSubmit = async (values: any) => {
    try {
      // Here you would typically make an API call to book the appointment
      console.log('Booking data:', { ...values, vaccine: selectedVaccine })

      notification.success({
        message: 'Đặt lịch thành công!',
        description:
          'Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn trong thời gian sớm nhất.',
        duration: 5
      })

      setBookingModalVisible(false)
      form.resetFields()
    } catch (error) {
      notification.error({
        message: 'Đặt lịch thất bại!',
        description: 'Vui lòng thử lại sau hoặc liên hệ hotline để được hỗ trợ.'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        <Carousel autoplay effect="fade" className="h-[500px]">
          {bannerSlides.map((slide) => (
            <div key={slide.id}>
              <div
                className="relative flex h-[500px] items-center justify-center"
                style={{
                  background: slide.background,
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                  <Badge.Ribbon text={slide.badge} color="red" className="mb-4">
                    <div />
                  </Badge.Ribbon>
                  <Title level={1} className="mb-4 !text-white">
                    {slide.title}
                  </Title>
                  <Title level={2} className="mb-4 !text-yellow-300">
                    {slide.subtitle}
                  </Title>
                  <Paragraph className="mb-8 text-lg !text-gray-200">
                    {slide.description}
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    onClick={() => setBookingModalVisible(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col key={index} xs={12} sm={6}>
                <Card className="text-center shadow-sm">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    valueStyle={{ fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Title level={2}>Danh Mục Vắc Xin</Title>
            <Paragraph className="text-lg text-gray-600">
              Tìm hiểu các loại vắc xin phù hợp với nhu cầu của bạn
            </Paragraph>
          </div>
          <Row gutter={[24, 24]}>
            {categories.map((category) => (
              <Col key={category.id} xs={24} sm={12} lg={6}>
                <Card
                  hoverable
                  className="h-full text-center transition-all duration-300 hover:shadow-lg"
                  bodyStyle={{ padding: '2rem' }}
                >
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <Title level={4} className="mb-2">
                    {category.name}
                  </Title>
                  <Text className="mb-4 block text-gray-600">
                    {category.description}
                  </Text>
                  <Tag color={category.color}>
                    {category.count} loại vắc xin
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Vaccines Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Title level={2}>Vắc Xin Nổi Bật</Title>
            <Paragraph className="text-lg text-gray-600">
              Các loại vắc xin được khuyên dùng và phổ biến nhất
            </Paragraph>
          </div>
          <Row gutter={[24, 24]}>
            {featuredVaccines.map((vaccine) => (
              <Col key={vaccine.id} xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  cover={
                    <div className="relative">
                      <img
                        alt={vaccine.name}
                        src={vaccine.image}
                        className="h-48 w-full object-cover"
                      />
                      <Badge.Ribbon text={vaccine.origin} color="blue" />
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      onClick={() => handleBooking(vaccine)}
                      className="w-full"
                    >
                      Đặt Lịch
                    </Button>
                  ]}
                  className="h-full"
                >
                  <Card.Meta
                    title={
                      <div className="mb-2">
                        <Title level={4} className="mb-1">
                          {vaccine.name}
                        </Title>
                        <Tag color="green">{vaccine.type}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 3 }}
                          className="mb-3 text-gray-600"
                        >
                          {vaccine.description}
                        </Paragraph>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <SafetyOutlined className="mr-2 text-blue-500" />
                            <Text strong>Phòng ngừa: </Text>
                            <Text>{vaccine.target_disease}</Text>
                          </div>
                          <div className="flex items-center">
                            <UserOutlined className="mr-2 text-green-500" />
                            <Text strong>Độ tuổi: </Text>
                            <Text>{vaccine.age_group}</Text>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div className="mt-8 text-center">
            <Button
              size="large"
              icon={<RightOutlined />}
              onClick={() => navigate('/vaccines')}
            >
              Xem Tất Cả Vắc Xin
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Process Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Title level={2}>Quy Trình Đặt Lịch</Title>
            <Paragraph className="text-lg text-gray-600">
              Đặt lịch tiêm chủng dễ dàng chỉ với 4 bước đơn giản
            </Paragraph>
          </div>
          <Steps current={-1} className="mx-auto max-w-4xl" responsive={false}>
            {bookingSteps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Title level={2}>Tại Sao Chọn Chúng Tôi?</Title>
            <Paragraph className="text-lg text-gray-600">
              Những lý do khiến hàng nghìn khách hàng tin tưởng lựa chọn dịch vụ
              của chúng tôi
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <TeamOutlined className="text-3xl text-blue-600" />
                </div>
                <Title level={4}>An Toàn & Chất Lượng</Title>
                <Paragraph className="text-gray-600">
                  Tất cả vắc xin đều được nhập khẩu chính hãng từ các nhà sản
                  xuất uy tín, được bảo quản trong điều kiện lạnh chuẩn quốc tế.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <TeamOutlined className="text-3xl text-green-600" />
                </div>
                <Title level={4}>Đội Ngũ Chuyên Nghiệp</Title>
                <Paragraph className="text-gray-600">
                  Đội ngũ y bác sĩ giàu kinh nghiệm, được đào tạo bài bản, luôn
                  tận tâm chăm sóc sức khỏe của bạn và gia đình.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                  <ClockCircleOutlined className="text-3xl text-purple-600" />
                </div>
                <Title level={4}>Tiện Lợi & Nhanh Chóng</Title>
                <Paragraph className="text-gray-600">
                  Đặt lịch online dễ dàng, thời gian chờ tối thiểu, quy trình
                  tiêm chủng nhanh gọn và thuận tiện.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Title level={2} className="mb-4 !text-white">
            Bảo Vệ Sức Khỏe Ngay Hôm Nay
          </Title>
          <Paragraph className="mb-8 text-lg text-blue-100">
            Đừng để bệnh tật đe dọa sức khỏe gia đình bạn. Hãy đặt lịch tiêm
            chủng ngay để được bảo vệ tốt nhất.
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<CalendarOutlined />}
              onClick={() => setBookingModalVisible(true)}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Đặt Lịch Ngay
            </Button>
            <Button
              size="large"
              icon={<PhoneOutlined />}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Hotline: 1900 1234
            </Button>
          </Space>
        </div>
      </section>

      {/* Booking Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-blue-600" />
            <span>Đặt Lịch Tiêm Chủng</span>
          </div>
        }
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedVaccine && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <Title level={5} className="mb-2">
              {selectedVaccine.name}
            </Title>
            <Text className="text-gray-600">
              {selectedVaccine.target_disease}
            </Text>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleBookingSubmit}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ!'
                  }
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Tuổi"
                rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
              >
                <Input type="number" placeholder="Nhập tuổi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[
                  { required: true, message: 'Vui lòng chọn giới tính!' }
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày tiêm"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày tiêm!' }
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Chọn ngày tiêm"
                  disabledDate={(current) =>
                    current && current.valueOf() < Date.now()
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Giờ tiêm"
                rules={[{ required: true, message: 'Vui lòng chọn giờ tiêm!' }]}
              >
                <Select placeholder="Chọn giờ tiêm">
                  <Option value="08:00">08:00</Option>
                  <Option value="09:00">09:00</Option>
                  <Option value="10:00">10:00</Option>
                  <Option value="11:00">11:00</Option>
                  <Option value="14:00">14:00</Option>
                  <Option value="15:00">15:00</Option>
                  <Option value="16:00">16:00</Option>
                  <Option value="17:00">17:00</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ chi tiết" />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setBookingModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Xác Nhận Đặt Lịch
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default VaccineHome
