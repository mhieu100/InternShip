import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Checkbox
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  FacebookOutlined
} from '@ant-design/icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { callRegister } from 'services/auth.api'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hook'
import GoogleLoginButton from 'components/GoogleLoginButton'

const { Title, Text } = Typography

const Register = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.account)
  const [form] = Form.useForm()

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const callback = params?.get('callback')

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = callback ? callback : '/'
    }
  }, [callback, isAuthenticated])

  const handleRegister = async (values: {
    name: string
    email: string
    password: string
  }) => {
    setLoading(true)
    const { name, email, password } = values
    const response = await callRegister(name, email, password)
    if (response && response.data) {
      message.success('Registration successful!')
      navigate('/login')
    } else {
      message.error(`Registration failed. ${response?.error}`)
    }
    setLoading(false)
  }

  const handleSocialRegister = (provider: string) => {
    message.info(`${provider} registration will be implemented soon!`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-lg rounded-xl border-0 shadow-2xl">
        <div className="mb-6 text-center">
          <Title level={2} className="mb-2">
            Create Account
          </Title>
          <Text type="secondary">Join ShopHub and start shopping today</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please input your full name!' },
              { min: 2, message: 'Name must be at least 2 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match!'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('Please accept the terms and conditions')
                      )
              }
            ]}
            className="mb-4"
          >
            <Checkbox>
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">Or sign up with</Text>
        </Divider>

        <div className="space-y-3 mb-6">
          <GoogleLoginButton />
        </div>

        <div className="text-center">
          <Text type="secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default Register
