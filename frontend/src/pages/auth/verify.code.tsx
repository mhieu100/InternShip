import { useState, useEffect, useRef } from 'react'
import { Card, Button, Typography, Space, Divider, message } from 'antd'
import {
  MailOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { callResendCode, callVerifyCode } from 'services/auth.api'

const { Title, Text, Link } = Typography

const VerifyCode = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const name = state?.userRegister.name
  const password = state?.userRegister.password
  const email = state?.userRegister.email || 'your-email@example.com'
  const purpose = state?.userRegister.purpose || 'email-verification' // 'password-reset' or 'email-verification'

  const countDown = () => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }

  useEffect(() => {
    countDown()
  }, [])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every((digit) => digit !== '') && value) {
      handleVerify(newCode)
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        const newCode = [...code]
        digits.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit
        })
        setCode(newCode)

        // Focus last filled input or next empty
        const lastIndex = Math.min(digits.length - 1, 5)
        inputRefs.current[lastIndex]?.focus()

        // Auto-verify if complete
        if (digits.length === 6) {
          handleVerify(newCode)
        }
      })
    }
  }

  const handleVerify = async (codeToVerify = code) => {
    const verificationCode = codeToVerify.join('')

    if (verificationCode.length !== 6) {
      message.error('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)

    const response = await callVerifyCode(
      Number(verificationCode),
      email,
      name,
      password
    )

    if (response && response.data) {
      if (purpose === 'password-reset') {
        navigate('/reset-password', {
          state: { email, token: verificationCode }
        })
      } else {
        message.success('Register success!')
        navigate('/login')
      }
    } else {
      message.error('Invalid verification code. Please try again.')
      setCode(['', '', '', '', '', ''])
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus()
        }
      }, 0)
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTimeLeft(60)
      countDown()
      setCanResend(false)
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      await callResendCode(email)
    } catch (error) {
      message.error('Failed to resend code. Please try again.')
      console.error('Resend error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    return purpose === 'password-reset'
      ? 'Verify Reset Code'
      : 'Verify Your Email'
  }

  const getDescription = () => {
    return purpose === 'password-reset'
      ? 'Enter the 6-digit code we sent to your email to reset your password.'
      : 'Enter the 6-digit code we sent to your email to verify your account.'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl border-0 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
              <MailOutlined className="text-2xl text-blue-600" />
            </div>
            <Title level={2} className="mb-2">
              {getTitle()}
            </Title>
            <Text type="secondary" className="mb-2 block text-base">
              {getDescription()}
            </Text>
            <Text strong className="text-blue-600">
              {email}
            </Text>
          </div>

          <div className="mb-6">
            <Text strong className="mb-4 block text-center">
              Enter Verification Code
            </Text>
            <div className="mb-4 flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="size-12 rounded-lg border-2 border-gray-300 text-center text-xl font-bold transition-colors focus:border-blue-500 focus:outline-none"
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
            disabled={code.some((digit) => digit === '')}
            className="mb-4 h-12 w-full rounded-lg text-base font-medium"
          >
            Verify Code
          </Button>

          <div className="space-y-4 text-center">
            <Text type="secondary" className="text-sm">
              Didn&apos;t receive the code?
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
  )
}

export default VerifyCode
