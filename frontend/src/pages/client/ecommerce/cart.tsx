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
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="py-16 text-center">
            <Empty
              image={
                <ShoppingOutlined className="text-4xl text-gray-300 sm:text-6xl" />
              }
              description={
                <div>
                  <Text className="mb-2 block text-lg text-gray-600 sm:text-xl">
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
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Mobile-optimized header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2 sm:gap-4">
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
          <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm sm:hidden">
            <div className="flex items-center justify-between">
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
            <div className="mb-4 flex items-center justify-between">
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
                className="mb-4 rounded-xl border-0 shadow-sm"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="mb-3 flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Title
                        level={5}
                        className="mb-1 text-sm leading-tight"
                        ellipsis={{ rows: 2 }}
                      >
                        {item.name}
                      </Title>
                      <Text type="secondary" className="mb-1 block text-xs">
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

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
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
                <div className="hidden items-start sm:flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                  />

                  <div className="ml-4 flex-1">
                    <Title level={5} className="mb-2">
                      {item.name}
                    </Title>
                    <Text type="secondary" className="mb-2 block">
                      {item.category}
                    </Text>
                    <Text
                      className="mb-2 block text-sm text-gray-600"
                      ellipsis={{ rows: 2 }}
                    >
                      {item.description}
                    </Text>
                    <Text className="text-lg font-semibold text-blue-600">
                      ${item.price}
                    </Text>
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-3">
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
              className="sticky top-6 hidden rounded-xl border-0 shadow-sm sm:block"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text className="text-gray-600">
                    Subtotal ({itemCount} items)
                  </Text>
                  <Text className="font-medium">${total.toFixed(2)}</Text>
                </div>

                <div className="flex items-center justify-between">
                  <Text className="text-gray-600">Shipping</Text>
                  <Text className="font-medium">
                    {total > 50 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      '$9.99'
                    )}
                  </Text>
                </div>

                <div className="flex items-center justify-between">
                  <Text className="text-gray-600">Tax (8%)</Text>
                  <Text className="font-medium">
                    ${(total * 0.08).toFixed(2)}
                  </Text>
                </div>

                {total > 50 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <Text className="text-sm text-green-700">
                      🎉 You saved $9.99 on shipping!
                    </Text>
                  </div>
                )}

                <Divider className="my-4" />

                <div className="flex items-center justify-between">
                  <Title level={4} className="mb-0">
                    Total
                  </Title>
                  <Title level={4} className="mb-0 text-blue-600">
                    $
                    {(total + (total > 50 ? 0 : 9.99) + total * 0.08).toFixed(
                      2
                    )}
                  </Title>
                </div>

                <Button
                  type="primary"
                  onClick={handleCheckout}
                  className="mt-4 h-12 w-full rounded-lg text-base font-semibold"
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-3 text-center">
                  <Text type="secondary" className="text-sm">
                    🔒 Secure checkout with SSL encryption
                  </Text>
                </div>
              </div>
            </Card>

            {/* Mobile Sticky Bottom Summary */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg sm:hidden">
              <div className="mx-auto max-w-6xl">
                <div className="mb-3 flex items-center justify-between">
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
                        <Text className="rounded bg-green-50 px-2 py-1 text-xs text-green-600">
                          Free shipping
                        </Text>
                      )}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    onClick={handleCheckout}
                    className="h-12 rounded-lg px-8 text-base font-semibold"
                  >
                    Checkout
                  </Button>
                </div>

                {/* Mobile expandable summary */}
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    View order details
                  </summary>
                  <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
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
        <div className="h-32 sm:hidden"></div>
      </div>
    </div>
  )
}

export default Cart
