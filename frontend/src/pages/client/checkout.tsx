import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Radio,
  Steps,
  Divider,
  Space,
  Alert,
  Checkbox,
  Tooltip,
  message
} from 'antd'
import {
  CreditCardOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  LockOutlined,
  SafetyOutlined,
  GiftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  BankOutlined,
  WalletOutlined,
  MobileOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { clearCart } from 'redux/slices/cartSlice'
import { useAppDispatch, useAppSelector } from 'redux/hook'

const { Title, Text, Paragraph } = Typography
const { Step } = Steps

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, total, itemCount } = useAppSelector((state) => state.cart)
  const { userInfo } = useAppSelector((state) => state.account)

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [selectedShipping, setSelectedShipping] = useState('standard')
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [orderNumber, setOrderNumber] = useState('')

  const [shippingForm] = Form.useForm()
  const [paymentForm] = Form.useForm()

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate('/cart')
    }
  }, [items, navigate, orderComplete])

  // Calculate totals
  const subtotal = total
  const shippingCost =
    selectedShipping === 'express' ? 15.99 : subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const discountAmount = subtotal * (discount / 100)
  const finalTotal = subtotal + shippingCost + tax - discountAmount

  const handlePromoCode = () => {
    const validCodes = {
      SAVE10: 10,
      WELCOME15: 15,
      FIRST20: 20
    }

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()])
      message.success(
        `Promo code applied! ${validCodes[promoCode.toUpperCase()]}% discount`
      )
    } else {
      message.error('Invalid promo code')
    }
  }

  const handleStepChange = (step) => {
    setCurrentStep(step)
  }

  const handleShippingNext = async () => {
    try {
      await shippingForm.validateFields()
      setCurrentStep(1)
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }

  const handlePaymentNext = async () => {
    try {
      await paymentForm.validateFields()
      setCurrentStep(2)
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const orderNum =
        'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      setOrderNumber(orderNum)
      setOrderComplete(true)
      dispatch(clearCart())

      message.success('Order placed successfully!')
    } catch (error) {
      message.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: subtotal > 50 ? 0 : 9.99,
      icon: <TruckOutlined />
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 15.99,
      icon: <ClockCircleOutlined />
    }
  ]

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCardOutlined />
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: <WalletOutlined />
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      description: 'Touch ID or Face ID',
      icon: <MobileOutlined />
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: <BankOutlined />
    }
  ]

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full rounded-2xl shadow-xl border-0 text-center">
          <div className="py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleOutlined className="text-4xl text-green-600" />
            </div>

            <Title level={2} className="text-green-600 mb-4">
              Order Confirmed!
            </Title>
            <Paragraph className="text-lg text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully
              placed.
            </Paragraph>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <Text type="secondary" className="block text-sm">
                    Order Number
                  </Text>
                  <Text strong className="text-lg">
                    {orderNumber}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" className="block text-sm">
                    Total Amount
                  </Text>
                  <Text strong className="text-lg text-green-600">
                    ${finalTotal.toFixed(2)}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" className="block text-sm">
                    Estimated Delivery
                  </Text>
                  <Text strong className="text-lg">
                    {selectedShipping === 'express' ? '2-3 days' : '5-7 days'}
                  </Text>
                </div>
              </div>
            </div>

            <Alert
              message="Order Confirmation Sent"
              description="We've sent a confirmation email with your order details and tracking information."
              type="success"
              showIcon
              className="mb-6"
            />

            <Space size="large">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/profile')}
              >
                View Order History
              </Button>
              <Button size="large" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/cart')}
              size="large"
              className="rounded-lg"
            >
              Back to Cart
            </Button>
            <div>
              <Title level={2} className="mb-0">
                Secure Checkout
              </Title>
              <Text type="secondary" className="flex items-center gap-1">
                <LockOutlined /> SSL Encrypted & Secure
              </Text>
            </div>
          </div>

          {/* Progress Steps */}
          <Card className="rounded-xl shadow-sm border-0">
            <Steps
              current={currentStep}
              onChange={handleStepChange}
              className="checkout-steps"
            >
              <Step
                title="Shipping"
                icon={<TruckOutlined />}
                description="Delivery information"
              />
              <Step
                title="Payment"
                icon={<CreditCardOutlined />}
                description="Payment method"
              />
              <Step
                title="Review"
                icon={<CheckCircleOutlined />}
                description="Confirm order"
              />
            </Steps>
          </Card>
        </div>

        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Step 1: Shipping Information */}
            {currentStep === 0 && (
              <Card className="rounded-xl shadow-sm border-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TruckOutlined className="text-blue-600" />
                  </div>
                  <Title level={3} className="mb-0">
                    Shipping Information
                  </Title>
                </div>

                <Form
                  form={shippingForm}
                  layout="vertical"
                  initialValues={{
                    firstName: userInfo?.name?.split(' ')[0] || '',
                    lastName: userInfo?.name?.split(' ')[1] || '',
                    email: userInfo?.email || ''
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your first name'
                          }
                        ]}
                      >
                        <Input size="large" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your last name'
                          }
                        ]}
                      >
                        <Input size="large" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your email'
                          },
                          {
                            type: 'email',
                            message: 'Please enter a valid email'
                          }
                        ]}
                      >
                        <Input size="large" prefix={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your phone number'
                          }
                        ]}
                      >
                        <Input size="large" prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Street Address"
                    name="address"
                    rules={[
                      { required: true, message: 'Please enter your address' }
                    ]}
                  >
                    <Input size="large" prefix={<EnvironmentOutlined />} />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="City"
                        name="city"
                        rules={[
                          { required: true, message: 'Please enter your city' }
                        ]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="State"
                        name="state"
                        rules={[
                          {
                            required: true,
                            message: 'Please select your state'
                          }
                        ]}
                      >
                        <Select size="large" placeholder="Select state">
                          <Select.Option value="CA">California</Select.Option>
                          <Select.Option value="NY">New York</Select.Option>
                          <Select.Option value="TX">Texas</Select.Option>
                          <Select.Option value="FL">Florida</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="ZIP Code"
                        name="zipCode"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your ZIP code'
                          }
                        ]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Shipping Options */}
                  <div className="mt-8">
                    <Title level={4} className="mb-4">
                      Shipping Method
                    </Title>
                    <Radio.Group
                      value={selectedShipping}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="w-full"
                    >
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <Radio.Button
                            key={option.id}
                            value={option.id}
                            className="w-full h-auto p-0 border-gray-200"
                          >
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-3">
                                <div className="text-lg text-blue-600">
                                  {option.icon}
                                </div>
                                <div>
                                  <Text strong className="block">
                                    {option.name}
                                  </Text>
                                  <Text type="secondary" className="text-sm">
                                    {option.description}
                                  </Text>
                                </div>
                              </div>
                              <div className="text-right">
                                <Text strong className="text-lg">
                                  {option.price === 0
                                    ? 'FREE'
                                    : `$${option.price}`}
                                </Text>
                                {option.price === 0 && (
                                  <Text
                                    type="secondary"
                                    className="block text-xs"
                                  >
                                    Orders over $50
                                  </Text>
                                )}
                              </div>
                            </div>
                          </Radio.Button>
                        ))}
                      </div>
                    </Radio.Group>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleShippingNext}
                      className="px-8 rounded-lg"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </Form>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 1 && (
              <Card className="rounded-xl shadow-sm border-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCardOutlined className="text-green-600" />
                  </div>
                  <Title level={3} className="mb-0">
                    Payment Information
                  </Title>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <Title level={4} className="mb-4">
                    Payment Method
                  </Title>
                  <Radio.Group
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <Radio.Button
                          key={method.id}
                          value={method.id}
                          className="h-auto p-0 border-gray-200"
                        >
                          <div className="p-4 text-center">
                            <div className="text-2xl text-blue-600 mb-2">
                              {method.icon}
                            </div>
                            <Text strong className="block">
                              {method.name}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {method.description}
                            </Text>
                          </div>
                        </Radio.Button>
                      ))}
                    </div>
                  </Radio.Group>
                </div>

                {/* Payment Form */}
                {selectedPayment === 'card' && (
                  <Form form={paymentForm} layout="vertical">
                    <Form.Item
                      label="Card Number"
                      name="cardNumber"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your card number'
                        }
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="1234 5678 9012 3456"
                        prefix={<CreditCardOutlined />}
                        maxLength={19}
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Expiry Date"
                          name="expiryDate"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter expiry date'
                            }
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="CVV"
                          name="cvv"
                          rules={[
                            { required: true, message: 'Please enter CVV' }
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="123"
                            maxLength={4}
                            suffix={
                              <Tooltip title="3-digit code on the back of your card">
                                <InfoCircleOutlined className="text-gray-400" />
                              </Tooltip>
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Cardholder Name"
                      name="cardholderName"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter cardholder name'
                        }
                      ]}
                    >
                      <Input size="large" placeholder="John Doe" />
                    </Form.Item>

                    <Form.Item name="saveCard" valuePropName="checked">
                      <Checkbox>Save this card for future purchases</Checkbox>
                    </Form.Item>
                  </Form>
                )}

                {selectedPayment === 'paypal' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <WalletOutlined className="text-2xl text-blue-600" />
                    </div>
                    <Text className="text-lg">
                      You will be redirected to PayPal to complete your payment
                    </Text>
                  </div>
                )}

                {selectedPayment === 'apple' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MobileOutlined className="text-2xl text-gray-600" />
                    </div>
                    <Text className="text-lg">
                      Use Touch ID or Face ID to pay with Apple Pay
                    </Text>
                  </div>
                )}

                {selectedPayment === 'bank' && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <Title level={5} className="mb-3">
                      Bank Transfer Details
                    </Title>
                    <div className="space-y-2 text-sm">
                      <div>
                        <Text strong>Bank:</Text> ShopHub Bank
                      </div>
                      <div>
                        <Text strong>Account:</Text> 1234567890
                      </div>
                      <div>
                        <Text strong>Routing:</Text> 987654321
                      </div>
                      <div>
                        <Text strong>Reference:</Text> Your order number
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button
                    size="large"
                    onClick={() => setCurrentStep(0)}
                    className="px-8 rounded-lg"
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handlePaymentNext}
                    className="px-8 rounded-lg"
                  >
                    Review Order
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 2 && (
              <Card className="rounded-xl shadow-sm border-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircleOutlined className="text-purple-600" />
                  </div>
                  <Title level={3} className="mb-0">
                    Review Your Order
                  </Title>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <Title level={4} className="mb-4">
                    Order Items
                  </Title>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Text strong className="block">
                            {item.name}
                          </Text>
                          <Text type="secondary" className="text-sm">
                            {item.category}
                          </Text>
                          <Text className="text-sm">Qty: {item.quantity}</Text>
                        </div>
                        <Text strong className="text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Title level={5} className="mb-3 text-blue-800">
                      Shipping Address
                    </Title>
                    <div className="text-sm space-y-1">
                      <div>
                        {shippingForm.getFieldValue('firstName')}{' '}
                        {shippingForm.getFieldValue('lastName')}
                      </div>
                      <div>{shippingForm.getFieldValue('address')}</div>
                      <div>
                        {shippingForm.getFieldValue('city')},{' '}
                        {shippingForm.getFieldValue('state')}{' '}
                        {shippingForm.getFieldValue('zipCode')}
                      </div>
                      <div>{shippingForm.getFieldValue('phone')}</div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <Title level={5} className="mb-3 text-green-800">
                      Payment Method
                    </Title>
                    <div className="flex items-center gap-2">
                      {
                        paymentMethods.find((m) => m.id === selectedPayment)
                          ?.icon
                      }
                      <Text>
                        {
                          paymentMethods.find((m) => m.id === selectedPayment)
                            ?.name
                        }
                      </Text>
                    </div>
                    {selectedPayment === 'card' && (
                      <Text type="secondary" className="text-sm block mt-1">
                        **** **** ****{' '}
                        {paymentForm.getFieldValue('cardNumber')?.slice(-4)}
                      </Text>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                  <Checkbox className="mb-2">
                    I agree to the{' '}
                    <Button type="link" className="p-0">
                      Terms and Conditions
                    </Button>{' '}
                    and{' '}
                    <Button type="link" className="p-0">
                      Privacy Policy
                    </Button>
                  </Checkbox>
                  <Checkbox>
                    I want to receive promotional emails and updates
                  </Checkbox>
                </div>

                <div className="flex justify-between">
                  <Button
                    size="large"
                    onClick={() => setCurrentStep(1)}
                    className="px-8 rounded-lg"
                  >
                    Back to Payment
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    onClick={handlePlaceOrder}
                    className="px-8 rounded-lg bg-green-600 hover:bg-green-700"
                  >
                    {loading
                      ? 'Processing...'
                      : `Place Order - $${finalTotal.toFixed(2)}`}
                  </Button>
                </div>
              </Card>
            )}
          </Col>

          {/* Order Summary Sidebar */}
          <Col xs={24} lg={8}>
            <Card className="rounded-xl shadow-sm border-0 sticky top-6">
              <Title level={4} className="mb-4">
                Order Summary
              </Title>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <Text className="text-sm font-medium block truncate">
                        {item.name}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        Qty: {item.quantity}
                      </Text>
                    </div>
                    <Text className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Promo Code */}
              <div className="mb-6">
                <Text strong className="block mb-2">
                  Promo Code
                </Text>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    prefix={<GiftOutlined />}
                  />
                  <Button onClick={handlePromoCode}>Apply</Button>
                </div>
                {discount > 0 && (
                  <Text type="success" className="text-sm block mt-1">
                    {discount}% discount applied!
                  </Text>
                )}
              </div>

              <Divider />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <Text>Subtotal ({itemCount} items)</Text>
                  <Text>${subtotal.toFixed(2)}</Text>
                </div>

                <div className="flex justify-between">
                  <Text>Shipping</Text>
                  <Text>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </Text>
                </div>

                <div className="flex justify-between">
                  <Text>Tax</Text>
                  <Text>${tax.toFixed(2)}</Text>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <Text>Discount ({discount}%)</Text>
                    <Text>-${discountAmount.toFixed(2)}</Text>
                  </div>
                )}
              </div>

              <Divider />

              <div className="flex justify-between items-center mb-6">
                <Title level={4} className="mb-0">
                  Total
                </Title>
                <Title level={4} className="mb-0 text-blue-600">
                  ${finalTotal.toFixed(2)}
                </Title>
              </div>

              {/* Security Badges */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <LockOutlined className="text-green-600 text-lg mb-1" />
                    <Text className="text-xs">SSL Secure</Text>
                  </div>
                  <div className="flex flex-col items-center">
                    <SafetyOutlined className="text-blue-600 text-lg mb-1" />
                    <Text className="text-xs">Safe Payment</Text>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircleOutlined className="text-green-600 text-lg mb-1" />
                    <Text className="text-xs">Guaranteed</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Checkout
