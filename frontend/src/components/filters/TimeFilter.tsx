import { DatePicker, Space } from 'antd'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface TimeFilterProps {
  onChange: (dates: [dayjs.Dayjs, dayjs.Dayjs]) => void
}

const TimeFilter = ({ onChange }: TimeFilterProps) => {
  const defaultStartTime = dayjs().set('hour', 7).startOf('hour')
  const defaultEndTime = dayjs()

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        showTime
        format="YYYY-MM-DD HH:mm"
        defaultValue={[defaultStartTime, defaultEndTime]}
        onChange={(dates) => {
          if (dates) {
            onChange([dates[0], dates[1]])
          }
        }}
      />
    </Space>
  )
}

export default TimeFilter
