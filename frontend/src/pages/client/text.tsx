import { Badge, Button, Calendar, Card, Flex } from 'antd'
import { CalendarProps } from 'antd/lib'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import myViLocale from './my_vi_locale'
import './customize.css'
import axios from 'axios'

const PageDemo = () => {
  const [data, setData] = useState([])
  const [selectedValue, setSelectedValue] = useState(() => dayjs(Date.now()))

  useEffect(() => {
    const handleData = async () => {
      const response = await axios.get('http://localhost:3000/workSchedules')
      setData(response.data)
    }
    handleData()
  }, [])

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }

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
            <li key={item.employeeName}>
              <div
                style={{
                  background: 'rgba(42, 237, 129, 0.5)',
                  padding: '10px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                  borderRadius: '10px',
                  border: '2px solid black'
                }}
                onClick={() => console.log(item.shift)}
              >
                <p>{item.employeeName}</p>
                <p>{item.shift}</p>
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
      <Card>
        <Calendar
          headerRender={({ value, onChange }) => {
            return (
              <Flex
                justify="space-between"
                align="center"
                style={{ width: '100%', padding: '20px' }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    onChange(value.clone().subtract(1, 'month'))
                  }}
                >
                  Tháng trước
                </Button>
                <span style={{ fontWeight: 'bold' }}>
                  {selectedValue.format('DD/MM/YYYY')}
                </span>
                <Button
                  type="primary"
                  onClick={() => onChange(value.clone().add(1, 'month'))}
                >
                  Tháng sau
                </Button>
              </Flex>
            )
          }}
          locale={myViLocale}
          cellRender={cellRender}
          value={selectedValue}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
        />
      </Card>
    </>
  )
}

export default PageDemo
