import { Table, Badge } from 'antd'
import type { TableProps } from 'antd'

interface ShelfData {
  key: string
  name: string
  operatingHours: string
  shortageHours: string
  shortageRate: number
  alerts: number
}

const columns: TableProps<ShelfData>['columns'] = [
  {
    title: 'Shelf Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <span className={record.alerts > 0 ? 'font-medium text-red-500' : ''}>
        {text}
      </span>
    )
  },
  {
    title: 'Operating Hours',
    dataIndex: 'operatingHours',
    key: 'operatingHours'
  },
  {
    title: 'Shortage Hours',
    dataIndex: 'shortageHours',
    key: 'shortageHours'
  },
  {
    title: 'Shortage Rate',
    dataIndex: 'shortageRate',
    key: 'shortageRate',
    render: (rate) => `${rate}%`
  },
  {
    title: 'Alerts',
    dataIndex: 'alerts',
    key: 'alerts',
    render: (alerts) =>
      alerts > 0 ? (
        <Badge count={alerts} style={{ backgroundColor: '#ff4d4f' }} />
      ) : (
        '-'
      )
  }
]

const data: ShelfData[] = [
  {
    key: '1',
    name: 'Energy Drink Shelf',
    operatingHours: '8:00 - 22:00',
    shortageHours: '2h 15m',
    shortageRate: 15,
    alerts: 3
  },
  {
    key: '2',
    name: 'Fresh Produce',
    operatingHours: '8:00 - 22:00',
    shortageHours: '6h',
    shortageRate: 40,
    alerts: 1
  },
  {
    key: '3',
    name: 'Beverage',
    operatingHours: '8:00 - 22:00',
    shortageHours: '1h',
    shortageRate: 5,
    alerts: 0
  }
]

const ShelfTable = () => {
  return <Table columns={columns} dataSource={data} pagination={false} />
}

export default ShelfTable
