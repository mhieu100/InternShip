import { Calendar, Card, Flex, Radio, Select, Space } from 'antd'
import { CalendarProps } from 'antd/lib'
import dayjs, { Dayjs } from 'dayjs'
import myViLocale from './my_vi_locale'
// import './customize.css'
import { IData } from 'types/backend'
import { useState } from 'react'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'

import dayLocaleData from 'dayjs/plugin/localeData'
dayjs.extend(dayLocaleData)

type PageProps = {
  data: IData[]
}

const PageDemo = ({ data }: PageProps) => {
  // const { token } = theme.useToken()

  const [selectedValue, setSelectedValue] = useState(() => dayjs(Date.now()))

  // useEffect(() => {
  //   const handleData = async () => {
  //     const response = await axios.get('http://localhost:3000/workSchedules')
  //     setData(response.data)
  //   }
  //   handleData()
  // }, [])

  const onSelect = (newValue: Dayjs) => {
    setSelectedValue(newValue)
  }

  const dateCellRender = (value: Dayjs) => {
    const listStaff = data.find(
      (item) => item.date === value.format('YYYY-MM-DD')
    )

    return (
      <>
        <ul>
          {listStaff?.shifts.map((item) => (
            <li key={item.staffName}>
              <div
                style={{
                  background: 'rgba(42, 237, 129, 0.5)',
                  padding: '10px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                  borderRadius: '10px',
                  border: '2px solid black'
                }}
              >
                <Flex justify="space-between">
                  <p>{item.staffName}</p>
                  <p>{item.areaName}</p>
                </Flex>
                <Flex justify="space-between">
                  <p>{item.startTime}</p>
                  <p>{item.endTime}</p>
                </Flex>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current) => {
    return dateCellRender(current)
  }

  return (
    <>
      {/* <FormAddShift setData={setData} /> */}
      <Card
        style={{
          margin: '20px',
          border: '2px solid black'
        }}
      >
        <Calendar
          headerRender={({ value, type, onChange, onTypeChange }) => {
            const year = value.year()
            const month = value.month()

            const yearOptions = Array.from({ length: 20 }, (_, i) => {
              const label = year - 10 + i
              return { label, value: label }
            })

            const monthOptions = value
              .localeData()
              .monthsShort()
              .map((label: string, index: number) => ({
                label,
                value: index
              }))

            return (
              <Flex justify="space-between">
                <Space>
                  <LeftCircleOutlined
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                      onChange(value.clone().subtract(1, 'month'))
                    }}
                  />
                  <RightCircleOutlined
                    style={{ fontSize: '20px' }}
                    onClick={() => onChange(value.clone().add(1, 'month'))}
                  />
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {selectedValue.format('[Tháng] M, YYYY')}
                  </span>
                </Space>
                <Space>
                  <Radio.Group
                    size="small"
                    onChange={(e) => onTypeChange(e.target.value)}
                    value={type}
                  >
                    <Radio.Button value="month">Month</Radio.Button>
                    <Radio.Button value="year">Year</Radio.Button>
                  </Radio.Group>
                  <Select
                    size="small"
                    popupMatchSelectWidth={false}
                    value={year}
                    options={yearOptions}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear)
                      onChange(now)
                    }}
                  />
                  <Select
                    size="small"
                    popupMatchSelectWidth={false}
                    value={month}
                    options={monthOptions}
                    onChange={(newMonth) => {
                      const now = value.clone().month(newMonth)
                      onChange(now)
                    }}
                  />
                </Space>
              </Flex>
            )
          }}
          locale={myViLocale}
          cellRender={cellRender}
          value={selectedValue}
          onSelect={onSelect}
        />
      </Card>

      {/* <Card>
        <DemoTable />
      </Card> */}
    </>
  )
}

export default PageDemo
