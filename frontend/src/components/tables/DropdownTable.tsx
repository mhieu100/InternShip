import { Card, Table } from 'antd'

interface DataType {
  key: React.ReactNode
  year: number
  children?: DataDay[]
}

interface DataDay {
  key: React.ReactNode
  day: number
  children?: DataMonth[]
}

interface DataMonth {
  key: React.ReactNode
  month: number
  children?: ShelfData[]
}

interface ShelfData {
  key: React.ReactNode
  shelfName: string
  totalHours: number
  shortageHours: number
  shortageRate: number
  numberTimeAlert: number
  numberTimeRecep: number
  recoveryRate: number
}

const columns = [
  {
    title: 'Year',
    dataIndex: 'year',
    width: '200px',
    key: 'year'
  },
  {
    title: 'Day',
    dataIndex: 'day',
    key: 'day'
  },
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month'
  },
  {
    title: 'Shelf Name',
    dataIndex: 'shelfName',
    key: 'shelfName'
  },
  {
    title: 'Total Hours',
    dataIndex: 'totalHours',
    key: 'totalHours'
  },
  {
    title: 'Shortage Hours',
    dataIndex: 'shortageHours',
    key: 'shortageHours'
  },
  {
    title: 'Shortage Rate (%)',
    dataIndex: 'shortageRate',
    key: 'shortageRate'
  },
  {
    title: 'Number Time Alert',
    dataIndex: 'numberTimeAlert',
    key: 'numberTimeAlert'
  },
  {
    title: 'Number Time Recep',
    dataIndex: 'numberTimeRecep',
    key: 'numberTimeRecep'
  },
  {
    title: 'Recovery Rate (%)',
    dataIndex: 'recoveryRate',
    key: 'recoveryRate'
  }
]

const data: DataType[] = [
  {
    key: 1,
    year: 2025,
    children: [
      {
        key: 3,
        day: 1,
        children: [
          {
            key: 5,
            month: 11,
            children: [
              {
                key: 8,
                shelfName: 'Shelf 1',
                totalHours: 8,
                shortageHours: 1.9,
                shortageRate: 32,
                numberTimeAlert: 5,
                numberTimeRecep: 3,
                recoveryRate: 30
              }
            ]
          },
          {
            key: 6,
            month: 12
          }
        ]
      },
      {
        key: 4,
        day: 2
      }
    ]
  },
  {
    key: 2,
    year: 2024
  }
]

const DropDownTable = () => {
  return (
    <Card title="Shelf Details" className="shadow-sm">
      <Table<DataType>
        columns={columns}
        dataSource={data}
        scroll={{ x: 800 }}
      />
    </Card>
  )
}

export default DropDownTable
