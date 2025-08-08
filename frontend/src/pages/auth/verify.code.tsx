import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, Alert, Space, Divider } from 'antd';
import { MailOutlined, ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  
  // Get email from navigation state or default
  const email = location.state?.email || 'your-email@example.com';
  const purpose = location.state?.purpose || 'password-reset'; // 'password-reset' or 'email-verification'

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && value) {
      handleVerify(newCode);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        const newCode = [...code];
        digits.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);
        
        // Focus last filled input or next empty
        const lastIndex = Math.min(digits.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
        
        // Auto-verify if complete
        if (digits.length === 6) {
          handleVerify(newCode);
        }
      });
    }
  };

  const handleVerify = async (codeToVerify = code) => {
    const verificationCode = codeToVerify.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API here
      // await authService.verifyCode(email, verificationCode, purpose);
      
      // Simulate success/failure
      if (verificationCode === '123456') {
        // Success - redirect based on purpose
        if (purpose === 'password-reset') {
          navigate('/reset-password', { state: { email, token: verificationCode } });
        } else {
          navigate('/login', { state: { message: 'Email verified successfully!' } });
        }
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset timer
      setTimeLeft(300);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
      
      // In a real app, you would call your API here
      // await authService.resendVerificationCode(email, purpose);
      
    } catch (error) {
      setError('Failed to resend code. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return purpose === 'password-reset' ? 'Verify Reset Code' : 'Verify Your Email';
  };

  const getDescription = () => {
    return purpose === 'password-reset' 
      ? 'Enter the 6-digit code we sent to your email to reset your password.'
      : 'Enter the 6-digit code we sent to your email to verify your account.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="rounded-2xl shadow-xl border-0">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailOutlined className="text-2xl text-blue-600" />
            </div>
            <Title level={2} className="mb-2">{getTitle()}</Title>
            <Text type="secondary" className="text-base block mb-2">
              {getDescription()}
            </Text>
            <Text strong className="text-blue-600">
              {email}
            </Text>
          </div>

          {error && (
            <Alert
              message="Verification Failed"
              description={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          <div className="mb-6">
            <Text strong className="block mb-4 text-center">Enter Verification Code</Text>
            <div className="flex justify-center gap-3 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={loading}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Space align="center" className="text-sm text-gray-500">
                <ClockCircleOutlined />
                <Text type="secondary">
                  Code expires in {formatTime(timeLeft)}
                </Text>
              </Space>
            </div>
          </div>

          <Button
            type="primary"
            onClick={() => handleVerify()}
            loading={loading}
            disabled={code.some(digit => digit === '')}
            className="w-full h-12 text-base font-medium rounded-lg mb-4"
          >
            Verify Code
          </Button>

          <div className="text-center space-y-4">
            <Text type="secondary" className="text-sm">
              Didn't receive the code?
            </Text>
            
            <Button
              type="link"
              onClick={handleResendCode}
              disabled={!canResend || loading}
              className="p-0"
            >
              {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
            </Button>

            <Divider />

            <Button
              type="link"
              onClick={() => navigate(-1)}
              icon={<ArrowLeftOutlined />}
              className="p-0"
            >
              Back
            </Button>
          </div>

          <Divider />

          <div className="text-center">
            <Text type="secondary" className="text-xs">
              Having trouble? Contact our{' '}
              <Link href="/support" className="text-blue-600">
                support team
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyCode;