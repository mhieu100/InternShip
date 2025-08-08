import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Progress } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Get email and token from navigation state
  const email = location.state?.email || '';
  const token = location.state?.token || '';

  // Redirect if no token
  React.useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 30) return '#ff4d4f';
    if (strength < 60) return '#faad14';
    if (strength < 80) return '#1890ff';
    return '#52c41a';
  };

  const getStrengthText = (strength) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API here
      // await authService.resetPassword(email, token, values.password);
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successfully! Please login with your new password.' 
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="rounded-2xl shadow-xl border-0">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleOutlined className="text-2xl text-green-600" />
              </div>
              <Title level={2} className="mb-2 text-green-600">Password Reset Successfully!</Title>
              <Text type="secondary" className="text-base block mb-4">
                Your password has been updated. You will be redirected to the login page shortly.
              </Text>
              
              <Alert
                message="Success"
                description="You can now login with your new password."
                type="success"
                showIcon
                className="mb-6"
              />

              <Button
                type="primary"
                onClick={() => navigate('/login')}
                className="w-full h-12 text-base font-medium rounded-lg"
              >
                Go to Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="rounded-2xl shadow-xl border-0">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockOutlined className="text-2xl text-blue-600" />
            </div>
            <Title level={2} className="mb-2">Reset Your Password</Title>
            <Text type="secondary" className="text-base">
              Create a new password for your account
            </Text>
            {email && (
              <Text strong className="block text-blue-600 mt-2">
                {email}
              </Text>
            )}
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 8, message: 'Password must be at least 8 characters long' },
                {
                  validator: (_, value) => {
                    if (!value || calculatePasswordStrength(value) >= 60) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Password is too weak. Please use a stronger password.'));
                  }
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter new password"
                size="large"
                className="rounded-lg"
                onChange={handlePasswordChange}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            {passwordStrength > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Text className="text-sm text-gray-600">Password Strength</Text>
                  <Text className="text-sm font-medium" style={{ color: getStrengthColor(passwordStrength) }}>
                    {getStrengthText(passwordStrength)}
                  </Text>
                </div>
                <Progress
                  percent={passwordStrength}
                  strokeColor={getStrengthColor(passwordStrength)}
                  showInfo={false}
                  size="small"
                />
              </div>
            )}

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm new password"
                size="large"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <div className="mb-6">
              <Alert
                message="Password Requirements"
                description={
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </div>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-base font-medium rounded-lg"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Text type="secondary" className="text-sm">
              Remember your password?{' '}
              <Button type="link" onClick={() => navigate('/login')} className="p-0">
                Back to Login
              </Button>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;