import { Card, Col, Row, Space, Typography } from 'antd'
import ShelfFilter from 'components/filters/ShelfFilter'
import TimeFilter from 'components/filters/TimeFilter'
import ShelfTable from 'components/tables/ShelfTable'
import { useEffect, useRef, useState } from 'react'
import { IMetric, Shelf } from 'types/backend'
import Barchart from './barchart'
import { callDemoData } from 'services/test'

const { Title } = Typography

const AnalysisShelf = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const isMountedRef = useRef(true)
  const [shelfs, setShelfs] = useState<Shelf[]>([])

  const [data, setData] = useState<IMetric[]>([])
  const groupData = regroupForChart(data)
  useEffect(() => {
    const callData = async () => {
      const response = await callDemoData()
      setData(response.data)
    }
    callData()
  }, [])

  function regroupForChart(data: IMetric[]) {
    const grouped = data.reduce((acc: any, item: any) => {
      if (!acc[item.shelveName]) {
        acc[item.shelveName] = []
      }
      acc[item.shelveName].push({ time: item.time, osaRate: item.osaRate })
      return acc
    }, {})

    return Object.keys(grouped).map((key) => ({
      shelveName: key,
      data: grouped[key].sort((a, b) => a.time.localeCompare(b.time))
    }))
  }

  useEffect(() => {
    isMountedRef.current = true
    connectWebSocket()

    return () => {
      isMountedRef.current = false
      disconnectWebSocket()
    }
  }, [])

  const connectWebSocket = () => {
    if (wsRef.current) {
      disconnectWebSocket()
    }
    wsRef.current = new WebSocket('ws://localhost:8083/data-stream')

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established')
    }
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setShelfs(data)
    }
    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed')
    }
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <Space>
          <Title level={2} className="!mb-0">
            Real-time Shelf Monitoring
          </Title>
        </Space>
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
      <Barchart groupData={groupData} />
      {/* Detailed Table Section */}
      <Row>
        <Col span={24}>
          <Card title="Shelf Details">
            <ShelfTable shelfs={shelfs} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AnalysisShelf
