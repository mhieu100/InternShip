import { Badge, Card, Col, Row, Select, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import ShelfFilter from 'components/filters/ShelfFilter'
import TimeFilter from 'components/filters/TimeFilter'
import StatsCard from 'components/stats/StatsCard'
import ShelfTable from 'components/tables/ShelfTable'

const { Title } = Typography

const AnalysisShelf = () => {
  const [selectedShelf, setSelectedShelf] = useState('all')
  const totalShelves = 15

  const shelfOptions = [
    { value: 'all', label: 'All Shelves' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'fresh', label: 'Fresh Produce' },
    { value: 'energy', label: 'Energy Drinks' }
  ]

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
            {/* OSA Line Chart will be added here */}
          </Card>
        </Col>
      </Row>

      {/* Stats Cards Section */}
      <Row gutter={[16, 16]} className="mb-6">
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
      </Row>

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
