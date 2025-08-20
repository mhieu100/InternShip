/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react'
import { Row, Col, Card, Statistic, Table, Tag } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  TrophyOutlined,
  ArrowUpOutlined
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const DashboardPage = () => {
  // Sample data for charts
  const trafficData = [
    { name: 'Jan', visitors: 4000, pageViews: 2400 },
    { name: 'Feb', visitors: 3000, pageViews: 1398 },
    { name: 'Mar', visitors: 2000, pageViews: 9800 },
    { name: 'Apr', visitors: 2780, pageViews: 3908 },
    { name: 'May', visitors: 1890, pageViews: 4800 },
    { name: 'Jun', visitors: 2390, pageViews: 3800 }
  ]

  const userSignupData = [
    { name: 'Mon', signups: 12 },
    { name: 'Tue', signups: 19 },
    { name: 'Wed', signups: 3 },
    { name: 'Thu', signups: 5 },
    { name: 'Fri', signups: 2 },
    { name: 'Sat', signups: 8 },
    { name: 'Sun', signups: 15 }
  ]

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#8884d8' },
    { name: 'Mobile', value: 35, color: '#82ca9d' },
    { name: 'Tablet', value: 20, color: '#ffc658' }
  ]

  // Recent posts data
  const recentPosts = [
    {
      key: '1',
      title: 'Getting Started with React',
      author: 'John Doe',
      status: 'Published',
      views: 1250,
      date: '2024-01-15'
    },
    {
      key: '2',
      title: 'Advanced JavaScript Concepts',
      author: 'Jane Smith',
      status: 'Draft',
      views: 0,
      date: '2024-01-14'
    },
    {
      key: '3',
      title: 'CSS Grid Layout Guide',
      author: 'Mike Johnson',
      status: 'Published',
      views: 890,
      date: '2024-01-13'
    }
  ]

  const postColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Published' ? 'green' : 'orange'}>{status}</Tag>
      )
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    }
  ]

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Key Metrics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={11280}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Posts"
              value={156}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Page Views"
              value={93280}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bounce Rate"
              value={32.5}
              prefix={<TrophyOutlined />}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Traffic Overview" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Visitors"
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Page Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Device Usage" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent = 0 }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="User Signups (Last 7 Days)" style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userSignupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="signups" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Posts" style={{ height: 350 }}>
            <Table
              columns={postColumns}
              dataSource={recentPosts}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
