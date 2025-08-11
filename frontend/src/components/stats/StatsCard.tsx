import { Card, Typography } from 'antd'

const { Text, Title } = Typography

interface StatsCardProps {
  title: string
  value: number
  type: 'danger' | 'warning' | 'success'
}

const StatsCard = ({ title, value, type }: StatsCardProps) => {
  const getColorClass = () => {
    switch (type) {
      case 'danger':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'success':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Card className="h-full">
      <div className="text-center">
        <Text className="text-gray-500">{title}</Text>
        <Title level={3} className={`!mb-0 ${getColorClass()}`}>
          {value}%
        </Title>
      </div>
    </Card>
  )
}

export default StatsCard
