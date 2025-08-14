import { Table, Badge } from 'antd'
import type { TableProps } from 'antd'
import { Shelf } from 'types/backend'

const columns: TableProps<Shelf>['columns'] = [
  {
    title: 'Shelf Name',
    dataIndex: 'shelveName',
    key: 'shelveName',
    render: (text) => <span>{text}</span>
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
    title: 'Alert Count',
    dataIndex: 'alertCount',
    key: 'alertCount',
    render: (alerts) =>
      alerts > 0 ? (
        <Badge count={alerts} style={{ backgroundColor: '#ff4d4f' }} />
      ) : (
        '-'
      )
  },
  {
    title: 'Replenish Count',
    dataIndex: 'replenishCount',
    key: 'replenishCount',
    render: (alerts) =>
      alerts > 0 ? (
        <Badge count={alerts} style={{ backgroundColor: '#ff4d4f' }} />
      ) : (
        '-'
      )
  },
  {
    title: 'Recovery Rate',
    dataIndex: 'recoveryRate',
    key: 'recoveryRate',
    render: (rate) => `${Math.round(rate)}%`
  }
]

interface Props {
  shelfs: Shelf[]
}

const ShelfTable = (props: Props) => {
  const { shelfs } = props
  return (
    <Table
      rowKey={'shelveId'}
      columns={columns}
      dataSource={shelfs}
      pagination={false}
    />
  )
}

export default ShelfTable
