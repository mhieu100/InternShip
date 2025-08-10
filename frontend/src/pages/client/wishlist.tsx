import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  Empty,
  Rate,
  Typography,
  Badge,
  Popconfirm,
  message
} from 'antd'
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  HeartFilled
} from '@ant-design/icons'
import { useAppDispatch } from 'redux/hook'
import { addToCart } from 'redux/slices/cartSlice'
import type { IProduct } from 'types/backend'

const { Title, Text } = Typography

// Temporary mock data for UI showcase
const mockWishlist: IProduct[] = [
  {
    id: 101,
    name: 'Wireless Headphones Pro',
    price: 129.99,
    image: 'https://picsum.photos/seed/headphones/600/400',
    category: 'Audio',
    rating: 4.5,
    reviews: 254,
    stock: 12
  },
  {
    id: 102,
    name: 'Smart Fitness Watch',
    price: 89.0,
    image: 'https://picsum.photos/seed/watch/600/400',
    category: 'Wearables',
    rating: 4.2,
    reviews: 318,
    stock: 5
  },
  {
    id: 103,
    name: '4K Action Camera',
    price: 199.0,
    image: 'https://picsum.photos/seed/camera/600/400',
    category: 'Cameras',
    rating: 4.6,
    reviews: 142,
    stock: 0
  }
]

const Wishlist = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [items, setItems] = useState<IProduct[]>(mockWishlist)

  const count = items.length
  const inStockCount = useMemo(
    () => items.filter((i) => (i.stock ?? 0) > 0).length,
    [items]
  )

  const handleRemove = (id?: number) => {
    if (typeof id === 'undefined') return
    setItems((prev) => prev.filter((p) => p.id !== id))
    message.success('Removed from wishlist')
  }

  const handleClear = () => {
    setItems([])
    message.success('Wishlist cleared')
  }

  const handleAddToCart = (product: IProduct) => {
    if ((product.stock ?? 0) === 0) return
    dispatch(addToCart(product))
    message.success('Added to cart')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="!mb-0">
            My Wishlist
          </Title>
        </div>
        <Card className="rounded-xl">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your wishlist is empty"
          >
            <Button type="primary" onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </Empty>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Title level={3} className="!mb-0">
            My Wishlist
          </Title>
          <Badge count={count} style={{ backgroundColor: '#1677ff' }} />
          <Text type="secondary" className="hidden md:inline">
            {inStockCount} in stock
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Popconfirm
            title="Clear wishlist?"
            description="This will remove all items from your wishlist."
            okText="Yes"
            cancelText="No"
            onConfirm={handleClear}
          >
            <Button danger icon={<DeleteOutlined />}>
              Clear All
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card
            key={item.id}
            hoverable
            className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition"
            cover={
              <div className="relative" style={{ height: 220 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  shape="circle"
                  icon={<HeartFilled className="text-red-500" />}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur border border-gray-300 hover:!bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(item.id)
                  }}
                  title="Remove from wishlist"
                />
                {(item.stock ?? 0) === 0 && (
                  <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            }
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Text
                  type="secondary"
                  className="text-xs uppercase tracking-wide"
                >
                  {item.category}
                </Text>
                <Rate
                  disabled
                  allowHalf
                  defaultValue={item.rating ?? 4}
                  className="text-sm"
                />
              </div>
              <Title level={5} className="mb-1" ellipsis={{ rows: 2 }}>
                {item.name}
              </Title>
              <div className="flex items-center justify-between">
                <Title level={4} className="!m-0 text-blue-600">
                  ${item.price?.toFixed(2)}
                </Title>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  disabled={(item.stock ?? 0) === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(item)
                  }}
                  className="flex-1"
                >
                  {(item.stock ?? 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Popconfirm
                  title="Remove item?"
                  okText="Remove"
                  cancelText="Cancel"
                  onConfirm={(e) => {
                    e?.stopPropagation()
                    handleRemove(item.id)
                  }}
                >
                  <Button icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
