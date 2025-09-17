import { Calendar, Card } from 'antd'
import './CalendarStyle.css'

const CalendarStyle = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card title="Styled Calendar">
        <Calendar className="custom-calendar" />
      </Card>
    </div>
  )
}

export default CalendarStyle
