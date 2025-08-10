import { Form, Input, Button, Card, Typography, Divider, message } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined
} from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { setUserLogin } from 'redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { callLogin } from 'services/auth.api'

const { Title, Text } = Typography

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.user)
  const [form] = Form.useForm()

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values
    const response = await callLogin(email, password)
    if (response && response.data) {
      dispatch(setUserLogin(response.data.user))
      localStorage.setItem('access_token', response.data.access_token)
      message.success('Login successful!')
      navigate('/')
    } else {
      message.error(`Login failed. ${response?.error}`)
    }
  }

  const handleSocialLogin = (provider: string) => {
    message.info(`${provider} login will be implemented soon!`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-md rounded-xl border-0 shadow-2xl">
        <div className="mb-6 text-center">
          <Title level={2} className="mb-2">
            Welcome Back
          </Title>
          <Text type="secondary">Sign in to your account to continue</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
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

          <Form.Item className="mb-4">
            <div className="flex justify-end">
              <Button
                type="link"
                onClick={() => navigate('/forgot-password')}
                className="p-0 text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </Button>
            </div>
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">Or continue with</Text>
        </Divider>

        <div className="space-y-3 mb-6">
          <Button
            icon={<GoogleOutlined />}
            size="large"
            className="w-full h-10 rounded-lg font-medium"
            onClick={() => handleSocialLogin('Google')}
          >
            Continue with Google
          </Button>

          <Button
            icon={<FacebookOutlined />}
            size="large"
            className="w-full h-10 rounded-lg font-medium"
            onClick={() => handleSocialLogin('Facebook')}
          >
            Continue with Facebook
          </Button>
        </div>

        <div className="text-center">
          <Text type="secondary">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign up
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage
