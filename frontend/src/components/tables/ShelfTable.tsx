import { Table, Badge, Typography, Progress } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { IShelf } from 'types/backend'

const { Text } = Typography

const columns: ColumnsType<IShelf> = [
  {
    title: 'Shelf Name',
    dataIndex: 'shelveName',
    key: 'shelveName',
    width: 150,
    fixed: 'left',
    render: (text) => <Text strong>{text}</Text>
  },
  {
    title: 'Operating Hours',
    dataIndex: 'operatingHours',
    key: 'operatingHours',
    width: 120,
    align: 'center',
    render: (hours) => <Text>{hours}h</Text>
  },
  {
    title: 'Shortage Hours',
    dataIndex: 'shortageHours',
    key: 'shortageHours',
    width: 120,
    align: 'center',
    render: (hours) => <Text>{hours}h</Text>
  },
  {
    title: 'Shortage Rate',
    dataIndex: 'shortageRate',
    key: 'shortageRate',
    width: 150,
    align: 'center',
    render: (rate) => {
      const percentage = Math.round(rate)
      return (
        <div>
          <Progress percent={percentage} size="small" className="mb-1" />
        </div>
      )
    }
  },
  {
    title: 'Alert Count',
    dataIndex: 'alertCount',
    key: 'alertCount',
    width: 100,
    align: 'center',
    render: (alerts) => <Badge count={alerts} overflowCount={99} />
  },
  {
    title: 'Replenish Count',
    dataIndex: 'replenishCount',
    key: 'replenishCount',
    width: 120,
    align: 'center',
    render: (replenish) => <Badge count={replenish} overflowCount={99} />
  },
  {
    title: 'Recovery Rate',
    dataIndex: 'recoveryRate',
    key: 'recoveryRate',
    width: 150,
    align: 'center',
    render: (rate) => {
      const percentage = Math.round(rate)
      return (
        <div>
          <Progress percent={percentage} size="small" className="mb-1" />
        </div>
      )
    }
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
      scroll={{ x: 900 }}
      size="middle"
      className="shadow-sm"
      bordered
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px'
      }}
    />
  )
}

export default ShelfTable
