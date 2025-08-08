import { Form, Input, Button, Card, Typography, Divider, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hook';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.user);
  const [form] = Form.useForm();

  const handleRegister = async (values: any) => {
    try {
      dispatch(registerStart());

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration and auto-login
      const mockUser = {
        id: Date.now(),
        email: values.email,
        name: values.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=3b82f6&color=fff`
      };

      dispatch(registerSuccess(mockUser));
      message.success('Account created successfully! Welcome to ShopHub!');
      navigate('/');

    } catch (error) {
      dispatch(registerFailure('Registration failed. Please try again.'));
      message.error('Registration failed. Please try again.');
    }
  };

  const handleSocialRegister = (provider: string) => {
    message.info(`${provider} registration will be implemented soon!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-lg shadow-2xl border-0 rounded-xl">
        <div className="text-center mb-6">
          <Title level={2} className="mb-2">Create Account</Title>
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
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
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
                  value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
              },
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
          <Button
            icon={<GoogleOutlined />}
            size="large"
            className="w-full h-10 rounded-lg font-medium"
            onClick={() => handleSocialRegister('Google')}
          >
            Sign up with Google
          </Button>

          <Button
            icon={<FacebookOutlined />}
            size="large"
            className="w-full h-10 rounded-lg font-medium"
            onClick={() => handleSocialRegister('Facebook')}
          >
            Sign up with Facebook
          </Button>
        </div>

        <div className="text-center">
          <Text type="secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;