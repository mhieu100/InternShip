/* eslint-disable no-constant-condition */
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
import { SearchOutlined, BarChartOutlined } from '@ant-design/icons'
import ShelfTable from 'components/tables/ShelfTable'
import { useEffect, useRef, useState } from 'react'
import {
  IMetric,
  IShortageByEachShelf,
  IShortageRateTotal,
  IShelf,
  IRecoveryRateTotal,
  IRecoveryByEachShelf
} from 'types/backend'
import Barchart, { IMetricData, IGroupData } from './barchart'
import LineChart from './linechart'
import GroupChart from './groupchart'
import dayjs from 'dayjs'
import {
  callAverageRecoveryRate,
  callAverageShortageRate,
  callGetShelves,
  callRecoveryStatusByEach,
  callShortageStatusByEach
} from 'services/analysis.api'
import DropDownTable from 'components/tables/DropdownTable'

const { Title } = Typography

const MAX_DATA_POINTS_PER_SHELF = 20

const AnalysisShelf = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const dataRef = useRef<IMetric[]>([])
  const isInitialLoadRef = useRef<boolean>(true)
  const [shelfs, setShelfs] = useState<IShelf[]>([])
  const [allShelves, setAllShelves] = useState<IShelf[]>([])
  const [data, setData] = useState<IMetric[]>([])
  const [selectedShelves, setSelectedShelves] = useState<number[]>([])

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    const fetchShelves = async () => {
      const response = await callGetShelves()
      setAllShelves(response.data.result)
    }
    fetchShelves()
  }, [])

  const groupData = regroupForChart(data).filter((shelf) => {
    if (selectedShelves.length === 0) return false
    const selectedShelfNames = selectedShelves
      .map((shelveId) => {
        const foundShelf = allShelves.find((s) => s.shelveId === shelveId)
        return foundShelf?.shelveName
      })
      .filter(Boolean)
    return selectedShelfNames.includes(shelf.shelveName)
  })

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

        if (wsRef.current) {
          wsRef.current.send(
            JSON.stringify({ type: 'IDS', data: selectedShelves })
          )
        }
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

  const handleShelfSelectionChange = (checkedValues: number[]) => {
    setSelectedShelves(checkedValues)
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'IDS', data: checkedValues }))
    }
  }

  const [form] = Form.useForm()

  const [shortageRate, setShortageRate] = useState<IShortageRateTotal[]>([])
  const [recoveryRate, setRecoveryRate] = useState<IRecoveryRateTotal[]>([])
  const [shortageByEach, setShortageByEach] = useState<IShortageByEachShelf[]>(
    []
  )
  const [recoveryByEach, setRecoveryByEach] = useState<IRecoveryByEachShelf[]>(
    []
  )
  const [availableShelves, setAvailableShelves] = useState<IShelf[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch available shelves for select options
  const fetchAvailableShelves = async () => {
    try {
      const response = await callGetShelves()
      if (response.data?.result) {
        setAvailableShelves(response.data.result)
      }
    } catch (error) {
      console.error('Error fetching shelves:', error)
    }
  }

  const handleGetData = async (values: { shelf: string[]; date: string[] }) => {
    setLoading(true)
    try {
      const { date, shelf } = values
      const startDate = dayjs(date[0]).format('YYYY-MM-DD')
      const endDate = dayjs(date[1]).format('YYYY-MM-DD')
      const [
        shortageResponse,
        recoveryResponse,
        shortageEachResponse,
        recoveryEachResponse
      ] = await Promise.all([
        callAverageShortageRate(String(startDate), String(endDate), shelf),
        callAverageRecoveryRate(String(startDate), String(endDate), shelf),
        callShortageStatusByEach(String(startDate), String(endDate), shelf),
        callRecoveryStatusByEach(String(startDate), String(endDate), shelf)
      ])

      setShortageRate(shortageResponse.data)
      setRecoveryRate(recoveryResponse.data)
      setShortageByEach(shortageEachResponse.data)
      setRecoveryByEach(recoveryEachResponse.data)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailableShelves()
    const values = {
      shelf: ['all'],
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

        <div className="mt-1 text-sm text-gray-500">
          Last update: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={6}>
          <Space direction="vertical" className="w-full">
            <Card title="Select Shelves" size="default" className="shadow-sm">
              <Checkbox.Group
                options={allShelves
                  .filter(
                    (shelf, index, self) =>
                      shelf &&
                      shelf.shelveId &&
                      shelf.shelveName &&
                      self.findIndex((s) => s.shelveId === shelf.shelveId) ===
                        index
                  )
                  .map((shelf) => ({
                    label: shelf.shelveName,
                    value: shelf.shelveId
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
              {groupData.length > 0 ? (
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
                        <Barchart groupData={[shelfData]} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <h3 className="mb-2 text-lg font-medium">
                    No Shelves Selected
                  </h3>
                  <p>
                    Please select shelves from the left panel to view charts
                  </p>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 md:mt-6">
        <Col span={24}>
          <Card title="Shelf Details">
            {selectedShelves.length > 0 ? (
              <ShelfTable
                shelfs={shelfs.filter((shelf) => {
                  return selectedShelves.includes(shelf.shelveId)
                })}
              />
            ) : (
              <div className="py-8 text-center text-gray-500">
                <h3 className="mb-2 text-lg font-medium">
                  No Shelves Selected
                </h3>
                <p>Please select shelves from the left panel to view details</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <SearchOutlined />
            <span>Analysis Filters</span>
          </Space>
        }
        className="mb-6 mt-4 shadow-sm"
        size="small"
        extra={
          <span className="text-xs text-gray-500">
            {availableShelves.length} shelves available
          </span>
        }
      >
        <Form
          form={form}
          onFinish={handleGetData}
          layout="inline"
          className="w-full"
          initialValues={{
            shelf: ['all'],
            date: [dayjs('2025/08/01'), dayjs('2025/08/30')]
          }}
        >
          <Row className="w-full" gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={10} lg={8}>
              <Form.Item name="date" label="Date Range" className="mb-0 w-full">
                <DatePicker.RangePicker
                  className="w-full"
                  placeholder={['Start Date', 'End Date']}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6} lg={12}>
              <Form.Item name="shelf" label="Shelf" className="mb-0 w-full">
                <Select
                  mode="multiple"
                  placeholder="Select shelf"
                  className="w-full"
                  loading={!availableShelves.length}
                >
                  <Select.Option value="all">
                    All Shelves ({availableShelves.length})
                  </Select.Option>
                  {availableShelves
                    .filter(
                      (shelf, index, self) =>
                        shelf &&
                        shelf.shelveId &&
                        self.findIndex((s) => s.shelveId === shelf.shelveId) ===
                          index
                    )
                    .map((shelf, index) => (
                      <Select.Option
                        key={`shelf-${shelf.shelveId}-${index}`}
                        value={shelf.shelveId}
                      >
                        {shelf.shelveName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={4} md={4} lg={4}>
              <Form.Item className="mb-0 w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  className="w-full"
                  loading={loading}
                >
                  Analyze
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>Analysis Results</span>
          </Space>
        }
        className="shadow-sm"
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={12}>
            <Card
              title="📈 Shortage Rate"
              className="h-full border border-gray-100 shadow-sm"
              size="small"
              styles={{
                body: {
                  padding: '16px',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }}
              extra={
                <span className="text-xs text-blue-600">
                  {shortageRate?.length || 0} data points
                </span>
              }
            >
              {shortageRate && shortageRate.length > 0 ? (
                <LineChart data={shortageRate} chartType="shortage" />
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <BarChartOutlined className="mb-2 text-4xl text-gray-300" />
                  <p>No data available for the selected period</p>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card
              title="📈 Recovery Rate"
              className="h-full border border-gray-100 shadow-sm"
              size="small"
              styles={{
                body: {
                  padding: '16px',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }}
              extra={
                <span className="text-xs text-blue-600">
                  {recoveryRate?.length || 0} data points
                </span>
              }
            >
              {recoveryRate && recoveryRate.length > 0 ? (
                <LineChart data={recoveryRate} chartType="recovery" />
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <BarChartOutlined className="mb-2 text-4xl text-gray-300" />
                  <p>No data available for the selected period</p>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card
              title="📊 Shelf Performance Comparison"
              className="h-full border border-gray-100 shadow-sm"
              size="small"
              styles={{
                body: {
                  padding: '16px',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }}
              extra={
                <span className="text-xs text-green-600">
                  {shortageByEach?.length || 0} shelves
                </span>
              }
            >
              {shortageByEach && shortageByEach.length > 0 ? (
                <GroupChart data={shortageByEach} chartType="shortage" />
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <BarChartOutlined className="mb-2 text-4xl text-gray-300" />
                  <p>No comparison data available</p>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card
              title="📊 Shelf Performance Comparison"
              className="h-full border border-gray-100 shadow-sm"
              size="small"
              styles={{
                body: {
                  padding: '16px',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }}
              extra={
                <span className="text-xs text-green-600">
                  {recoveryByEach?.length || 0} shelves
                </span>
              }
            >
              {recoveryByEach && recoveryByEach.length > 0 ? (
                <GroupChart data={recoveryByEach} chartType="recovery" />
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <BarChartOutlined className="mb-2 text-4xl text-gray-300" />
                  <p>No comparison data available</p>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>

      <Row className="mt-4 md:mt-6" gutter={20}>
        <Col span={24}>
          <DropDownTable />
        </Col>
      </Row>
    </div>
  )
}

export default AnalysisShelf
