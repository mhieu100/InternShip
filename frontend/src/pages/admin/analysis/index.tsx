import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Typography
} from 'antd'
import ShelfTable from 'components/tables/ShelfTable'
import { useEffect, useRef, useState } from 'react'
import {
  IMetric,
  IShortageByEachShelf,
  IShortageRateTotal,
  IShelf
} from 'types/backend'
import Barchart, { IMetricData, IGroupData } from './barchart'
import LineChart from './linechart'
import GroupChart from './groupchart'
import dayjs from 'dayjs'
import { callData, callData_1 } from 'services/analysis.api'
import DropDownTable from 'components/tables/DropdownTable'

const { Title } = Typography

const MAX_DATA_POINTS_PER_SHELF = 20

const AnalysisShelf = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const dataRef = useRef<IMetric[]>([])
  const isInitialLoadRef = useRef<boolean>(true)
  const [shelfs, setShelfs] = useState<IShelf[]>([])
  const [data, setData] = useState<IMetric[]>([])
  const [selectedShelves, setSelectedShelves] = useState<string[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('')

  useEffect(() => {
    dataRef.current = data
  }, [data])

  const allShelves = [...new Set(data.map((item) => item.shelveName))]

  const groupData = regroupForChart(data).filter(
    (shelf) =>
      selectedShelves.length === 0 || selectedShelves.includes(shelf.shelveName)
  )

  useEffect(() => {
    let reconnectAttempts = 0
    const MAX_RECONNECT_ATTEMPTS = 2
    let reconnectTimer: string | number | NodeJS.Timeout | null | undefined =
      null
    let isMounted = true
    const wsConnection = () => {
      if (!isMounted) return

      console.log('Attempting to connect to WebSocket...')
      wsRef.current = new WebSocket('ws://localhost:8083/data-stream')

      wsRef.current.onopen = () => {
        reconnectAttempts = 0
        console.log('WebSocket connection established')
      }

      wsRef.current.onmessage = (event) => {
        if (!isMounted) return
        try {
          console.log('Raw WebSocket data:', event.data)
          const parsedData = JSON.parse(event.data)
          console.log('Parsed WebSocket data:', parsedData)

          if (
            !parsedData ||
            typeof parsedData !== 'object' ||
            !parsedData.type ||
            !parsedData.data
          ) {
            console.error('Invalid message format:', parsedData)
            return
          }

          if (parsedData.type === 'metrics' && Array.isArray(parsedData.data)) {
            const metricData = parsedData.data as IMetric[]
            console.log('Processing metrics data:', metricData)

            const newDataPoints = metricData.filter(
              (metric) =>
                !dataRef.current.some(
                  (existing) =>
                    existing.shelveName === metric.shelveName &&
                    existing.time === metric.time &&
                    existing.osaRate === metric.osaRate
                )
            )

            console.log(
              `New data points: ${newDataPoints.length}/${metricData.length}`
            )

            if (newDataPoints.length > 0) {
              setData((prevData) => {
                const merged = [...prevData, ...newDataPoints]

                const sorted = merged.sort((a, b) => {
                  const timeComparison = a.time.localeCompare(b.time)
                  if (timeComparison !== 0) return timeComparison
                  return a.shelveName.localeCompare(b.shelveName)
                })

                const limitedData: IMetric[] = []
                const shelfDataCount: Record<string, number> = {}

                sorted.reverse().forEach((metric) => {
                  const count = shelfDataCount[metric.shelveName] || 0
                  if (count < MAX_DATA_POINTS_PER_SHELF) {
                    limitedData.unshift(metric)
                    shelfDataCount[metric.shelveName] = count + 1
                  }
                })

                return limitedData
              })

              const latestTime = Math.max(
                ...newDataPoints.map((m) => parseInt(m.time.replace(':', '')))
              )
              const latestTimeStr =
                newDataPoints.find(
                  (m) => parseInt(m.time.replace(':', '')) === latestTime
                )?.time || ''

              setLastUpdateTime(latestTimeStr)
              console.log(`Last update time: ${latestTimeStr}`)

              if (isInitialLoadRef.current) {
                isInitialLoadRef.current = false
              }
            }
          } else if (
            parsedData.type === 'summary' &&
            Array.isArray(parsedData.data)
          ) {
            const summaryData = parsedData.data as IShelf[]
            console.log('Processing summary data:', summaryData)
            setShelfs(summaryData)
          } else {
            console.warn('Unknown message type:', parsedData.type)
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      wsRef.current.onclose = (e) => {
        if (!isMounted) {
          console.log('Websocket close !')
          return
        }
        if (e.code === 1000) {
          console.log('Connection closed by server')
          return
        }
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(5000 * (reconnectAttempts + 1), 30000)
          reconnectTimer = setTimeout(() => {
            if (isMounted) wsConnection()
          }, delay)
          reconnectAttempts++
          console.log(
            `Retrying in ${delay / 1000}s... (Attempt ${reconnectAttempts})`
          )
        } else {
          console.error('Max reconnection attempts reached')
        }
      }
    }

    wsConnection()

    return () => {
      isMounted = false

      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(1000, 'Component unmounted')
        } else if (wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.onopen = null
          wsRef.current.close(1001, 'Connection cancelled')
        }
      }
    }
  }, [])

  function regroupForChart(data: IMetric[]): IGroupData[] {
    const grouped = data.reduce(
      (acc: Record<string, IMetricData[]>, item: IMetric) => {
        if (!acc[item.shelveName]) {
          acc[item.shelveName] = []
        }
        acc[item.shelveName].push({
          time: item.time || '',
          osaRate: item.osaRate
        })
        return acc
      },
      {}
    )

    return Object.keys(grouped).map(
      (key): IGroupData => ({
        shelveName: key,
        data: grouped[key].sort((a: IMetricData, b: IMetricData) =>
          a.time.localeCompare(b.time)
        )
      })
    )
  }

  const handleShelfSelectionChange = (checkedValues: string[]) => {
    setSelectedShelves(checkedValues)
  }

  const [form] = Form.useForm()

  const [chartOne, setChartOne] = useState<IShortageRateTotal[]>([])
  const [chartTwo, setChartTwo] = useState<IShortageByEachShelf[]>([])

  const handleGetData = async (values: { shelf: string; date: string[] }) => {
    const { date, shelf } = values
    const startDate = dayjs(date[0]).format('YYYY-MM-DD')
    const endDate = dayjs(date[1]).format('YYYY-MM-DD')

    const responseChart1 = await callData(
      String(startDate),
      String(endDate),
      shelf
    )
    setChartOne(responseChart1.data)
    const responseChart2 = await callData_1(
      String(startDate),
      String(endDate),
      shelf
    )
    console.log(responseChart2)
    setChartTwo(responseChart2.data)
  }

  useEffect(() => {
    const values = {
      shelf: 'all',
      date: ['2025/08/01', '2025/08/30']
    }
    handleGetData(values)
  }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <Title level={2} className="!mb-0 !text-lg md:!text-2xl">
          Real-time Shelf Monitoring
        </Title>
        {lastUpdateTime && (
          <div className="mt-1 text-sm text-gray-500">
            Last update: {lastUpdateTime}
          </div>
        )}
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={6}>
          <Space direction="vertical" className="w-full">
            <Card title="Select Shelves" size="default" className="shadow-sm">
              <Checkbox.Group
                options={allShelves.map((shelf) => ({
                  label: shelf,
                  value: shelf
                }))}
                value={selectedShelves}
                onChange={handleShelfSelectionChange}
                className="flex flex-col"
              />
            </Card>
          </Space>
        </Col>

        <Col xs={24} md={16} lg={18}>
          <Card
            title="Shelf OSA Rate Charts"
            className="shadow-sm"
            styles={{
              body: { padding: '8px' },
              header: { padding: '0 12px' }
            }}
          >
            <div className="max-h-[calc(100vh-600px)] overflow-y-auto p-2">
              <Row gutter={[12, 12]}>
                {groupData.map((shelfData) => (
                  <Col xs={24} key={shelfData.shelveName}>
                    <Card
                      title={
                        <span className="text-sm md:text-base">
                          {shelfData.shelveName}
                        </span>
                      }
                      size="small"
                      className="shadow-sm"
                      styles={{
                        body: { padding: '12px' },
                        header: { padding: '0 12px' }
                      }}
                    >
                      <Barchart
                        groupData={[shelfData]}
                        config={{
                          dimensions: {
                            width: 800,
                            height: 280,
                            margin: {
                              top: 20,
                              right: 20,
                              bottom: 30,
                              left: 50
                            }
                          }
                        }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 md:mt-6">
        <Col span={24}>
          <Card title="Shelf Details">
            <ShelfTable shelfs={shelfs} />
          </Card>
        </Col>
      </Row>

      <Row className="mt-10 md:mt-10">
        <Form
          form={form}
          onFinish={handleGetData}
          layout="horizontal"
          initialValues={{
            shelf: 'all',
            date: [dayjs('2025/08/01'), dayjs('2025/08/30')]
          }}
        >
          <Form.Item name="date" label="Date">
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item name="shelf" label="Select">
            <Select placeholder="Select shelf">
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="shelf_1">Shelf 1</Select.Option>
              <Select.Option value="shelf_2">Shelf 2</Select.Option>
              <Select.Option value="shelf_3">Shelf 3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Row>

      <Row className="mt-4 md:mt-6" gutter={20}>
        <Col span={12}>
          <Card title="Shelf Details" className="shadow-sm">
            <LineChart data={chartOne} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Shelf Details" className="shadow-sm">
            <GroupChart data={chartTwo} />
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 md:mt-6" gutter={20}>
        <Col span={24}>
          <DropDownTable />
        </Col>
      </Row>
    </div>
  )
}

export default AnalysisShelf
