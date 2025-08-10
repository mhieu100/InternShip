import { useState } from 'react'
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Form,
  Input,
  Avatar,
  Tabs,
  Table,
  Tag,
  Progress,
  Badge,
  Modal,
  Select,
  Switch,
  Statistic
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SettingOutlined,
  TrophyOutlined,
  GiftOutlined,
  SecurityScanOutlined,
  BellOutlined,
  MailOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  DeleteOutlined,
  LockOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { setLogout } from 'redux/slices/authSlice'
import { callLogout } from 'services/auth.api'

const { Title, Text, Paragraph } = Typography

const Profile = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [avatarModalVisible, setAvatarModalVisible] = useState(false)
  const [securityModalVisible, setSecurityModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [securityForm] = Form.useForm()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleLogout = async () => {
    await callLogout()
    localStorage.removeItem('access_token')
    dispatch(setLogout())
    navigate('/')
  }

  const handleSaveProfile = (values: any) => {
    console.log('Saving profile:', values)
    setEditMode(false)
    // Here you would dispatch an action to update user profile
  }

  // Mock order data
  const orders = [
    {
      key: '1',
      orderId: '#ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: '$299.99',
      items: 3
    },
    {
      key: '2',
      orderId: '#ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: '$149.50',
      items: 2
    },
    {
      key: '3',
      orderId: '#ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: '$89.99',
      items: 1
    }
  ]

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue'
        if (status === 'Delivered') color = 'green'
        if (status === 'Shipped') color = 'orange'
        if (status === 'Processing') color = 'blue'
        return <Tag color={color}>{status}</Tag>
      }
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" size="small">
          View Details
        </Button>
      )
    }
  ]

  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: '$199.99',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: '$299.99',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Enhanced Profile Header */}
        <Card className="mb-8 rounded-2xl shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          <div className="px-6 pb-6 -mt-16 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <div className="relative">
                <Avatar
                  size={120}
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-xl bg-gradient-to-br from-blue-400 to-purple-500"
                />
                <Button
                  icon={<CameraOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => setAvatarModalVisible(true)}
                  className="absolute bottom-2 right-2 bg-white text-gray-600 border-2 border-white shadow-lg hover:bg-blue-50"
                />
                <Badge
                  status="success"
                  className="absolute top-2 right-2"
                  title="Online"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Title level={2} className="mb-0 text-gray-800">
                        {user?.name || 'John Doe'}
                      </Title>
                      <Badge
                        count="VIP"
                        style={{ backgroundColor: '#f59e0b' }}
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <MailOutlined className="text-gray-400" />
                      <Text className="text-gray-600">
                        {user?.email || 'john.doe@example.com'}
                      </Text>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarOutlined />
                        Member since Jan 2024
                      </span>
                      <span className="flex items-center gap-1">
                        <TrophyOutlined />
                        Gold Member
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(!editMode)}
                      type={editMode ? 'primary' : 'default'}
                      size="large"
                      className="rounded-lg"
                    >
                      {editMode ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button
                      icon={<SettingOutlined />}
                      size="large"
                      className="rounded-lg"
                      onClick={() => setActiveTab('4')}
                    >
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <Statistic
                  title="Total Orders"
                  value={12}
                  prefix={<ShoppingOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                />
              </div>
              <div className="text-center">
                <Statistic
                  title="Wishlist Items"
                  value={8}
                  prefix={<HeartOutlined className="text-red-500" />}
                  valueStyle={{ color: '#f5222d', fontSize: '20px' }}
                />
              </div>
              <div className="text-center">
                <Statistic
                  title="Reward Points"
                  value={2450}
                  prefix={<GiftOutlined className="text-orange-500" />}
                  valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                />
              </div>
              <div className="text-center">
                <Statistic
                  title="Total Saved"
                  value={189}
                  prefix="$"
                  suffix="USD"
                  valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Sidebar */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            {/* Account Level Progress */}
            <Card className="mb-6 rounded-xl shadow-sm border-0">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrophyOutlined className="text-2xl text-white" />
                </div>
                <Title level={4} className="mb-1">
                  Gold Member
                </Title>
                <Text type="secondary">2,450 / 5,000 points to Platinum</Text>
              </div>

              <Progress
                percent={49}
                strokeColor={{
                  '0%': '#fbbf24',
                  '100%': '#f59e0b'
                }}
                className="mb-4"
              />

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
                <Text className="text-sm text-orange-800">
                  🎉 Earn 2,550 more points to unlock Platinum benefits!
                </Text>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-xl shadow-sm border-0">
              <Title level={4} className="mb-4">
                Recent Activity
              </Title>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircleOutlined className="text-green-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="text-sm font-medium block">
                      Order #ORD-001 delivered
                    </Text>
                    <Text type="secondary" className="text-xs">
                      2 hours ago
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <GiftOutlined className="text-blue-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="text-sm font-medium block">
                      Earned 150 reward points
                    </Text>
                    <Text type="secondary" className="text-xs">
                      1 day ago
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TruckOutlined className="text-orange-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="text-sm font-medium block">
                      Order #ORD-002 shipped
                    </Text>
                    <Text type="secondary" className="text-xs">
                      3 days ago
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className="rounded-xl shadow-sm border-0">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="large"
                className="profile-tabs"
                items={[
                  {
                    key: '1',
                    label: (
                      <span className="flex items-center gap-2">
                        <UserOutlined />
                        Personal Info
                      </span>
                    ),
                    children: (
                      <div className="py-4">
                        {editMode ? (
                          <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSaveProfile}
                            initialValues={{
                              name: user?.name || 'John Doe',
                              email: user?.email || 'john.doe@example.com',
                              phone: '+1 (555) 123-4567',
                              address: '123 Main St, City, State 12345',
                              bio: 'I love shopping for quality products and discovering new brands.'
                            }}
                          >
                            <Row gutter={16}>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Full Name"
                                  name="name"
                                  rules={[{ required: true }]}
                                >
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Email"
                                  name="email"
                                  rules={[{ required: true, type: 'email' }]}
                                >
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row gutter={16}>
                              <Col xs={24} sm={12}>
                                <Form.Item label="Phone" name="phone">
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Date of Birth"
                                  name="birthday"
                                >
                                  <Input
                                    size="large"
                                    placeholder="MM/DD/YYYY"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item label="Address" name="address">
                              <Input.TextArea rows={3} />
                            </Form.Item>

                            <Form.Item label="Bio" name="bio">
                              <Input.TextArea
                                rows={4}
                                placeholder="Tell us about yourself..."
                              />
                            </Form.Item>

                            <div className="flex gap-2">
                              <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                              >
                                Save Changes
                              </Button>
                              <Button
                                size="large"
                                onClick={() => setEditMode(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </Form>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Text type="secondary">Full Name</Text>
                                <div className="text-base font-medium">
                                  {user?.name || 'John Doe'}
                                </div>
                              </div>
                              <div>
                                <Text type="secondary">Email</Text>
                                <div className="text-base font-medium">
                                  {user?.email || 'john.doe@example.com'}
                                </div>
                              </div>
                              <div>
                                <Text type="secondary">Phone</Text>
                                <div className="text-base font-medium">
                                  +1 (555) 123-4567
                                </div>
                              </div>
                              <div>
                                <Text type="secondary">Date of Birth</Text>
                                <div className="text-base font-medium">
                                  January 15, 1990
                                </div>
                              </div>
                            </div>

                            <div>
                              <Text type="secondary">Address</Text>
                              <div className="text-base font-medium">
                                123 Main St, City, State 12345
                              </div>
                            </div>

                            <div>
                              <Text type="secondary">Bio</Text>
                              <Paragraph className="text-base">
                                I love shopping for quality products and
                                discovering new brands. Always looking for the
                                best deals and latest trends.
                              </Paragraph>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  },
                  {
                    key: '2',
                    label: (
                      <span className="flex items-center gap-2">
                        <ShoppingOutlined />
                        Order History
                      </span>
                    ),
                    children: (
                      <div className="py-4">
                        <div className="flex justify-between items-center mb-6">
                          <Title level={4}>Recent Orders</Title>
                          <Button type="primary">View All Orders</Button>
                        </div>
                        <Table
                          columns={orderColumns}
                          dataSource={orders}
                          pagination={false}
                          className="rounded-lg"
                        />
                      </div>
                    )
                  },
                  {
                    key: '3',
                    label: (
                      <span className="flex items-center gap-2">
                        <HeartOutlined />
                        Wishlist
                      </span>
                    ),
                    children: (
                      <div className="py-4">
                        <div className="flex justify-between items-center mb-6">
                          <Title level={4}>My Wishlist</Title>
                          <Button type="primary">Browse Products</Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {wishlistItems.map((item) => (
                            <Card key={item.id} className="rounded-lg">
                              <div className="text-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <Title level={5} className="mb-2">
                                  {item.name}
                                </Title>
                                <Text strong className="text-blue-600 text-lg">
                                  {item.price}
                                </Text>
                                <div className="mt-3 space-y-2">
                                  <Button type="primary" block>
                                    Add to Cart
                                  </Button>
                                  <Button block>Remove</Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  },
                  {
                    key: '4',
                    label: (
                      <span className="flex items-center gap-2">
                        <SettingOutlined />
                        Settings
                      </span>
                    ),
                    children: (
                      <div className="py-6">
                        <Title level={4} className="mb-6">
                          Account Settings
                        </Title>

                        <div className="space-y-6">
                          {/* Notification Settings */}
                          <Card className="rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <BellOutlined className="text-blue-500 text-lg" />
                                <div>
                                  <Text strong>Email Notifications</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Receive updates about your orders and
                                    account
                                  </Text>
                                </div>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </Card>

                          {/* Security Settings */}
                          <Card className="rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <LockOutlined className="text-green-500 text-lg" />
                                <div>
                                  <Text strong>Two-Factor Authentication</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Add an extra layer of security to your
                                    account
                                  </Text>
                                </div>
                              </div>
                              <Button
                                type="primary"
                                onClick={() => setSecurityModalVisible(true)}
                              >
                                Configure
                              </Button>
                            </div>
                          </Card>

                          {/* Privacy Settings */}
                          <Card className="rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <SafetyOutlined className="text-purple-500 text-lg" />
                                <div>
                                  <Text strong>Profile Visibility</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Control who can see your profile information
                                  </Text>
                                </div>
                              </div>
                              <Select
                                defaultValue="friends"
                                style={{ width: 120 }}
                              >
                                <Select.Option value="public">
                                  Public
                                </Select.Option>
                                <Select.Option value="friends">
                                  Friends
                                </Select.Option>
                                <Select.Option value="private">
                                  Private
                                </Select.Option>
                              </Select>
                            </div>
                          </Card>

                          {/* Danger Zone */}
                          <Card className="rounded-lg border border-red-200 bg-red-50">
                            <Title level={5} className="text-red-600 mb-4">
                              Danger Zone
                            </Title>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Text strong>Delete Account</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Permanently delete your account and all data
                                  </Text>
                                </div>
                                <Button danger>Delete Account</Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Text strong>Sign Out All Devices</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Sign out from all devices except this one
                                  </Text>
                                </div>
                                <Button danger onClick={handleLogout}>
                                  Sign Out All
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>

        {/* Avatar Upload Modal */}
        <Modal
          title="Update Profile Picture"
          open={avatarModalVisible}
          onCancel={() => setAvatarModalVisible(false)}
          footer={null}
          className="avatar-modal"
        >
          <div className="text-center py-6">
            <Avatar
              size={120}
              src={user?.avatar}
              icon={<UserOutlined />}
              className="mb-6"
            />
            <div className="space-y-4">
              <Button
                type="primary"
                icon={<CameraOutlined />}
                size="large"
                block
              >
                Upload New Photo
              </Button>
              <Button icon={<DeleteOutlined />} size="large" block>
                Remove Current Photo
              </Button>
            </div>
          </div>
        </Modal>

        {/* Security Settings Modal */}
        <Modal
          title="Security Settings"
          open={securityModalVisible}
          onCancel={() => setSecurityModalVisible(false)}
          footer={null}
          width={600}
        >
          <div className="py-4">
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircleOutlined className="text-green-600 text-lg" />
                  <div>
                    <Text strong className="text-green-800">
                      Account Secure
                    </Text>
                    <Text className="block text-sm text-green-600">
                      Your account has strong security settings enabled
                    </Text>
                  </div>
                </div>
              </div>

              <Form form={securityForm} layout="vertical">
                <Form.Item label="Current Password" name="currentPassword">
                  <Input.Password
                    size="large"
                    placeholder="Enter current password"
                  />
                </Form.Item>

                <Form.Item label="New Password" name="newPassword">
                  <Input.Password
                    size="large"
                    placeholder="Enter new password"
                  />
                </Form.Item>

                <Form.Item label="Confirm New Password" name="confirmPassword">
                  <Input.Password
                    size="large"
                    placeholder="Confirm new password"
                  />
                </Form.Item>

                <div className="flex gap-3">
                  <Button type="primary" size="large">
                    Update Password
                  </Button>
                  <Button
                    size="large"
                    onClick={() => setSecurityModalVisible(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Profile
