import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hook';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.user);
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    try {
      dispatch(loginStart());

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser = {
        id: 1,
        email: values.email,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      };

      dispatch(loginSuccess(mockUser));
      message.success('Login successful!');
      navigate('/');

    } catch (error) {
      dispatch(loginFailure('Login failed. Please try again.'));
      message.error('Login failed. Please check your credentials.');
    }
  };

  const handleSocialLogin = (provider : string) => {
    message.info(`${provider} login will be implemented soon!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-xl">
        <div className="text-center mb-6">
          <Title level={2} className="mb-2">Welcome Back</Title>
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
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;