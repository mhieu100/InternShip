import { Badge, Card, Col, Row, Select, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import ShelfFilter from 'components/filters/ShelfFilter'
import TimeFilter from 'components/filters/TimeFilter'
import StatsCard from 'components/stats/StatsCard'
import ShelfTable from 'components/tables/ShelfTable'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { data } from 'react-router-dom'

const { Title } = Typography

const AnalysisShelf = () => {
  const [selectedShelf, setSelectedShelf] = useState('all')
  const totalShelves = 15
  const [data, setData] = useState([])
  const shelfOptions = [
    { value: 'all', label: 'All Shelves' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'fresh', label: 'Fresh Produce' },
    { value: 'energy', label: 'Energy Drinks' }
  ]

  useEffect(() => {
    // Tạo sẵn toàn bộ các mốc thời gian
    const timeSlots = []
    const startHour = 7
    const endHour = 17

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        if (hour === endHour && minute > 0) break
        timeSlots.push({
          time: `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`,
          percentage: Math.floor(Math.random() * 100) + 1
        })
      }
    }

    let index = 0
    const interval = setInterval(() => {
      if (index < timeSlots.length) {
        setData((prev) => [...prev, timeSlots[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 1000) // mỗi 1 giây thêm 1 giá trị

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <Space>
          <Title level={2} className="!mb-0">
            Real-time Shelf Monitoring
          </Title>
          <Badge count={totalShelves} style={{ marginLeft: '8px' }} />
        </Space>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={(value) => setSelectedShelf(value)}
          options={shelfOptions}
        />
      </div>

      {/* Toolbar Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col>
          <ShelfFilter onSearch={(value) => console.log('Search:', value)} />
        </Col>
        <Col>
          <TimeFilter onChange={(dates) => console.log('Time range:', dates)} />
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card title="OSA Performance">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="percentage" fill="#1890ff" />
                <ReferenceLine
                  y={40}
                  stroke="red"
                  strokeDasharray="3 3"
                  label="Threshold 40%"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards Section */}
      {/* <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <StatsCard title="Overall OSA Rate" value={85} type="success" />
        </Col>
        <Col span={6}>
          <StatsCard title="Total Price Rate" value={40} type="warning" />
        </Col>
        <Col span={6}>
          <StatsCard title="Fresh Produce" value={40} type="warning" />
        </Col>
        <Col span={6}>
          <StatsCard title="Energy Drinks" value={15} type="danger" />
        </Col>
      </Row> */}

      {/* Detailed Table Section */}
      <Row>
        <Col span={24}>
          <Card title="Shelf Details">
            <ShelfTable />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AnalysisShelf
