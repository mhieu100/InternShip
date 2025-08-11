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
      className="rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500 group h-full flex flex-col"
      cover={
        <div className="relative overflow-hidden" style={{ height: '240px' }}>
          <img
            alt={product.name}
            src={product.image}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              icon={<EyeOutlined />}
              onClick={handleViewProduct}
              title="Quick View"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-300 shadow-md hover:bg-blue-500 hover:border-blue-500 hover:text-white text-xs"
            />
            <Button
              icon={<HeartOutlined />}
              onClick={handleWishlist}
              title="Add to Wishlist"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-300 shadow-md hover:bg-red-500 hover:border-red-500 hover:text-white text-xs"
            />
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
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
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <Text
            type="secondary"
            className="text-xs uppercase tracking-wide font-medium"
          >
            {product.category}
          </Text>
        </div>

        <Title level={5} className="mt-1 mb-2 flex-grow" ellipsis={{ rows: 2 }}>
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

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Title level={4} className="text-blue-600 m-0">
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
          className="w-full h-10 rounded-lg font-medium hover:-translate-y-0.5 transition-transform mt-auto"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard
