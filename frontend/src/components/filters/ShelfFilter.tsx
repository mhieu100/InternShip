import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface ShelfFilterProps {
  onSearch: (value: string) => void
}

const ShelfFilter = ({ onSearch }: ShelfFilterProps) => {
  return (
    <Input
      placeholder="Search shelf name"
      prefix={<SearchOutlined />}
      onChange={(e) => onSearch(e.target.value)}
      style={{ width: 200 }}
    />
  )
}

export default ShelfFilter
