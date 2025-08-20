import { Result, Button, Typography } from 'antd'
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleShopNow = () => {
    navigate('/products')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <Result
        icon={
          <div className="mb-4 text-6xl font-black leading-none text-blue-600 drop-shadow-lg md:text-8xl lg:text-9xl">
            404
          </div>
        }
        title={
          <Title level={2} className="m-0 font-bold text-gray-800">
            Oops! Page Not Found
          </Title>
        }
        subTitle={
          <div className="mb-8">
            <Paragraph className="m-0 text-base text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </Paragraph>
            <Paragraph className="mt-2 text-sm text-gray-500">
              Don't worry, it happens to the best of us. Let's get you back on
              track!
            </Paragraph>
          </div>
        }
        extra={
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              className="w-full border-blue-600 bg-blue-600 hover:bg-blue-700 sm:w-auto"
            >
              Go Home
            </Button>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              className="w-full hover:border-blue-600 hover:text-blue-600 sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              type="default"
              size="large"
              onClick={handleShopNow}
              className="w-full hover:border-blue-600 hover:text-blue-600 sm:w-auto"
            >
              Shop Now
            </Button>
          </div>
        }
        className="w-full max-w-2xl rounded-2xl bg-white p-12 shadow-2xl"
      />
    </div>
  )
}

export default NotFound
