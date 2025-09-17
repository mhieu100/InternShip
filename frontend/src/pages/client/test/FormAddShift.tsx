import {
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Flex,
  Row,
  Select
} from 'antd'
import { IData } from 'types/backend'

type FormProps = {
  setData: (data: IData) => void
}

const FormAddShift = ({ setData }: FormProps) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }

  const handleAdd = () => {
    console.log('Add Shift')
    // const item = {
    //   date: '2025-09-20',
    //   shift: {
    //     employeeName: 'Nguyễn Văn A',
    //     shift: 'Morning',
    //     area: 'Lễ tân'
    //   }
    // }
    // setData((prev) => {
    //   const existDate = prev.find((data) => data.date === item.date)
    //   if (existDate) {
    //     return prev.map((data) =>
    //       data.date === item.date
    //         ? { ...data, shifts: [...data.shifts, item.shift] }
    //         : data
    //     )
    //   } else {
    //     return [...prev, { date: item.date, shifts: [item.shift] }]
    //   }
    // })
  }

  return (
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
      </Row>
      <Flex justify="end">
        <Button type="primary" onClick={handleAdd}>
          Thêm ca
        </Button>
      </Flex>
    </Card>
  )
}

export default FormAddShift
