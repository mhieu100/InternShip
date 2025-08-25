import { Table, Badge, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { IShelf } from 'types/backend'

const { Text } = Typography

const columns: ColumnsType<IShelf> = [
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
    render: (rate) => `${Math.round(rate)}%`
  },
  {
    title: 'Alert Count',
    dataIndex: 'alertCount',
    key: 'alertCount',
    render: (alerts) =>
      alerts > 0 ? (
        <Badge count={alerts} style={{ backgroundColor: '#ff4d4f' }} />
      ) : (
        <Badge count={0} style={{ backgroundColor: '#ff4d4f' }} />
      )
  },
  {
    title: 'Replenish Count',
    dataIndex: 'replenishCount',
    key: 'replenishCount',
    render: (replenish) =>
      replenish > 0 ? (
        <Badge count={replenish} style={{ backgroundColor: '#ff4d4f' }} />
      ) : (
        <Text>0</Text>
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
  shelfs: IShelf[]
}

const ShelfTable = (props: Props) => {
  const { shelfs } = props
  return (
    <Table
      rowKey={'shelveId'}
      columns={columns}
      dataSource={Array.isArray(shelfs) ? shelfs : []}
      pagination={false}
      scroll={{ x: 800 }}
    />
  )
}

export default ShelfTable
