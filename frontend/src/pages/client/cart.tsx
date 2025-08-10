import React from 'react'
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  InputNumber,
  Empty,
  Divider,
  Space
} from 'antd'
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  removeFromCart,
  updateQuantity,
  clearCart
} from 'redux/slices/cartSlice'
import { useAppDispatch, useAppSelector } from 'redux/hook'

const { Title, Text } = Typography

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, total, itemCount } = useAppSelector((state) => state.cart)

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }))
    }
  }

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center py-16">
            <Empty
              image={
                <ShoppingOutlined className="text-4xl sm:text-6xl text-gray-300" />
              }
              description={
                <div>
                  <Text className="text-lg sm:text-xl text-gray-600 block mb-2">
                    Your cart is empty
                  </Text>
                  <Text type="secondary" className="text-sm sm:text-base">
                    Discover amazing products and start shopping today!
                  </Text>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={() => navigate('/products')}
                className="mt-4 h-12 px-8 text-base font-medium"
              >
                Start Shopping
              </Button>
            </Empty>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile-optimized header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 sm:gap-4 mb-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/products')}
              className="flex-shrink-0"
              size="small"
            >
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <Title level={2} className="mb-0 text-lg sm:text-2xl">
              <span className="hidden sm:inline">
                Shopping Cart ({itemCount} items)
              </span>
              <span className="sm:hidden">Cart ({itemCount})</span>
            </Title>
          </div>

          {/* Mobile cart summary bar */}
          <div className="sm:hidden bg-white rounded-lg p-4 shadow-sm border mb-4">
            <div className="flex justify-between items-center">
              <div>
                <Text className="text-sm text-gray-600">
                  Total ({itemCount} items)
                </Text>
                <Title level={4} className="mb-0 text-blue-600">
                  ${(total + (total > 50 ? 0 : 9.99) + total * 0.08).toFixed(2)}
                </Title>
              </div>
              <Button
                type="primary"
                onClick={handleCheckout}
                className="h-10 px-6 font-medium"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="flex justify-between items-center mb-4">
              <Text strong className="text-base sm:text-lg">
                Cart Items
              </Text>
              <Button
                type="text"
                danger
                onClick={handleClearCart}
                disabled={items.length === 0}
                size="small"
                className="text-xs sm:text-sm"
              >
                Clear Cart
              </Button>
            </div>

            {items.map((item) => (
              <Card
                key={item.id}
                className="mb-4 rounded-xl shadow-sm border-0"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="flex gap-3 mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Title
                        level={5}
                        className="mb-1 text-sm leading-tight"
                        ellipsis={{ rows: 2 }}
                      >
                        {item.name}
                      </Title>
                      <Text type="secondary" className="text-xs block mb-1">
                        {item.category}
                      </Text>
                      <Text className="text-sm font-semibold text-blue-600">
                        ${item.price}
                      </Text>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.id)}
                      size="small"
                      className="flex-shrink-0 p-1"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Text className="text-sm">Qty:</Text>
                      <InputNumber
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(item.id, value)
                        }
                        className="w-16"
                        size="small"
                      />
                    </div>
                    <Text className="text-lg font-semibold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1 ml-4">
                    <Title level={5} className="mb-2">
                      {item.name}
                    </Title>
                    <Text type="secondary" className="block mb-2">
                      {item.category}
                    </Text>
                    <Text
                      className="block mb-2 text-sm text-gray-600"
                      ellipsis={{ rows: 2 }}
                    >
                      {item.description}
                    </Text>
                    <Text className="text-lg font-semibold text-blue-600">
                      ${item.price}
                    </Text>
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-4">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.id)}
                      size="small"
                    >
                      Remove
                    </Button>

                    <Space align="center">
                      <Text>Qty:</Text>
                      <InputNumber
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(item.id, value)
                        }
                        className="w-20"
                      />
                    </Space>

                    <Text className="text-lg font-semibold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </Col>

          <Col xs={24} lg={8}>
            {/* Desktop Order Summary */}
            <Card
              title="Order Summary"
              className="hidden sm:block rounded-xl sticky top-6 shadow-sm border-0"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">
                    Subtotal ({itemCount} items)
                  </Text>
                  <Text className="font-medium">${total.toFixed(2)}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Shipping</Text>
                  <Text className="font-medium">
                    {total > 50 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      '$9.99'
                    )}
                  </Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Tax (8%)</Text>
                  <Text className="font-medium">
                    ${(total * 0.08).toFixed(2)}
                  </Text>
                </div>

                {total > 50 && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <Text className="text-green-700 text-sm">
                      🎉 You saved $9.99 on shipping!
                    </Text>
                  </div>
                )}

                <Divider className="my-4" />

                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">
                    Total
                  </Title>
                  <Title level={4} className="text-blue-600 mb-0">
                    $
                    {(total + (total > 50 ? 0 : 9.99) + total * 0.08).toFixed(
                      2
                    )}
                  </Title>
                </div>

                <Button
                  type="primary"
                  onClick={handleCheckout}
                  className="w-full h-12 text-base font-semibold rounded-lg mt-4"
                >
                  Proceed to Checkout
                </Button>

                <div className="text-center mt-3">
                  <Text type="secondary" className="text-sm">
                    🔒 Secure checkout with SSL encryption
                  </Text>
                </div>
              </div>
            </Card>

            {/* Mobile Sticky Bottom Summary */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <Text className="text-sm text-gray-600">
                      Total ({itemCount} items)
                    </Text>
                    <div className="flex items-center gap-2">
                      <Title level={4} className="mb-0 text-blue-600">
                        $
                        {(
                          total +
                          (total > 50 ? 0 : 9.99) +
                          total * 0.08
                        ).toFixed(2)}
                      </Title>
                      {total > 50 && (
                        <Text className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          Free shipping
                        </Text>
                      )}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    onClick={handleCheckout}
                    className="h-12 px-8 text-base font-semibold rounded-lg"
                  >
                    Checkout
                  </Button>
                </div>

                {/* Mobile expandable summary */}
                <details className="text-sm">
                  <summary className="text-gray-600 cursor-pointer hover:text-gray-800">
                    View order details
                  </summary>
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Subtotal</Text>
                      <Text>${total.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Shipping</Text>
                      <Text>{total > 50 ? 'Free' : '$9.99'}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Tax</Text>
                      <Text>${(total * 0.08).toFixed(2)}</Text>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </Col>
        </Row>

        {/* Mobile bottom spacing to prevent content being hidden behind sticky footer */}
        <div className="sm:hidden h-32"></div>
      </div>
    </div>
  )
}

export default Cart
