import {
  Button,
  Calendar,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Flex,
  Modal,
  Row,
  Select
} from 'antd'
import { CalendarProps } from 'antd/lib'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import myViLocale from './my_vi_locale'
import './customize.css'
import axios from 'axios'

interface IData {
  date: string
  shifts: IStaff[]
}

interface IStaff {
  employeeName: string
  shift: string
}

const PageDemo = () => {
  // const { token } = theme.useToken()

  const [data, setData] = useState<IData[]>([])
  const [selectedValue, setSelectedValue] = useState(() => dayjs(Date.now()))
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
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
                onClick={() => showModal()}
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

  // const wrapperStyle: React.CSSProperties = {
  //   width: 300,
  //   border: `1px solid ${token.colorBorderSecondary}`,
  //   borderRadius: token.borderRadiusLG
  // }

  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }

  const handleAdd = () => {
    const item = {
      date: '2025-09-20',
      shift: {
        employeeName: 'Nguyễn Văn A',
        shift: 'Morning',
        area: 'Lễ tân'
      }
    }
    setData((prev) => {
      const existDate = prev.find((data) => data.date === item.date)
      if (existDate) {
        return prev.map((data) =>
          data.date === item.date
            ? { ...data, shifts: [...data.shifts, item.shift] }
            : data
        )
      } else {
        return [...prev, { date: item.date, shifts: [item.shift] }]
      }
    })
  }

  return (
    <>
      <Card
        style={{
          margin: '20px',
          border: '2px solid black'
        }}
      >
        <p style={{ fontSize: '20px' }}>Thêm ca làm việc</p>
        <Row style={{ margin: '20px 0' }} gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Select
              placeholder="Chọn..."
              style={{ width: '100%' }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'yiminghe', label: 'Yiminghe' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Select
              placeholder="Chọn..."
              style={{ width: '100%' }}
              onChange={handleChange}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'yiminghe', label: 'Yiminghe' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <DatePicker style={{ width: '100%' }} onChange={onChange} />
          </Col>
          {/* <Col xs={24} sm={12} md={12} lg={6}>
            <Select
              placeholder="Chọn..."
              style={{ width: '100%' }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'yiminghe', label: 'Yiminghe' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Select
              placeholder="Chọn..."
              style={{ width: '100%' }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'yiminghe', label: 'Yiminghe' }
              ]}
            />
          </Col> */}
        </Row>
        <Flex justify="end">
          <Button type="primary" onClick={handleAdd}>
            Thêm ca
          </Button>
        </Flex>
      </Card>

      <Card
        style={{
          margin: '20px',
          border: '2px solid black'
        }}
      >
        {/* <div style={wrapperStyle}> */}
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
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {selectedValue.format('[Tháng] M, YYYY')}
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
        {/* </div> */}
      </Card>

      <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  )
}

export default PageDemo
