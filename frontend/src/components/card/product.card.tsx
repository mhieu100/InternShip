import { Card, Button, Rate, Typography, Badge } from 'antd'
import {
  ShoppingCartOutlined,
  EyeOutlined,
  HeartOutlined
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from 'redux/slices/cartSlice'
import { IProduct } from 'types/backend'

const { Text, Title } = Typography

interface IProps {
  product: IProduct
}

const ProductCard = (props: IProps) => {
  const { product } = props

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(addToCart(product))
  }

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Handle wishlist functionality
    console.log('Added to wishlist:', product.id)
  }

  return (
    <Card
      hoverable
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl"
      cover={
        <div className="relative overflow-hidden" style={{ height: '240px' }}>
          <img
            alt={product.name}
            src={product.image}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              icon={<EyeOutlined />}
              onClick={handleViewProduct}
              title="Quick View"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-xs shadow-md backdrop-blur-sm hover:border-blue-500 hover:bg-blue-500 hover:text-white"
            />
            <Button
              icon={<HeartOutlined />}
              onClick={handleWishlist}
              title="Add to Wishlist"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-xs shadow-md backdrop-blur-sm hover:border-red-500 hover:bg-red-500 hover:text-white"
            />
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      }
      onClick={handleViewProduct}
      style={{
        padding: '16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <Text
            type="secondary"
            className="text-xs font-medium uppercase tracking-wide"
          >
            {product.category}
          </Text>
        </div>

        <Title level={5} className="mb-2 mt-1 flex-grow" ellipsis={{ rows: 2 }}>
          {product.name}
        </Title>

        <div className="mb-3">
          <Rate
            disabled
            defaultValue={product.rating || 4}
            className="text-sm"
          />
          <Text type="secondary" className="ml-2 text-xs">
            ({product.reviews || 128})
          </Text>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Title level={4} className="m-0 text-blue-600">
              ${product.price}
            </Title>
            {/* {product.originalPrice && (
              <Text delete className="text-gray-400 text-sm">
                ${product.originalPrice}
              </Text>
            )} */}
          </div>
          <Badge
            count={(product.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
            style={{
              backgroundColor: (product.stock ?? 0) > 0 ? '#52c41a' : '#ff4d4f',
              fontSize: '10px'
            }}
          />
        </div>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-auto h-10 w-full rounded-lg font-medium transition-transform hover:-translate-y-0.5"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard
