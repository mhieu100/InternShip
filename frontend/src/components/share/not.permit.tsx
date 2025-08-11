import { Result, Button, Typography } from 'antd'
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const NotPermit = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <Result
        icon={
          <div className="text-6xl md:text-8xl lg:text-9xl font-black text-blue-600 leading-none mb-4 drop-shadow-lg">
            403
          </div>
        }
        title={
          <Title level={2} className="text-gray-800 font-bold m-0">
            Oops! Access Denied
          </Title>
        }
        subTitle={
          <div className="mb-8">
            <Paragraph className="text-base text-gray-600 m-0">
              You do not have permission to access this page.
            </Paragraph>
            <Paragraph className="text-sm text-gray-500 mt-2">
              Please contact your administrator if you believe this is an error.
            </Paragraph>
          </div>
        }
        extra={
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 w-full sm:w-auto"
            >
              Go Home
            </Button>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              className="hover:border-blue-600 hover:text-blue-600 w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              type="default"
              size="large"
              onClick={handleShopNow}
              className="hover:border-blue-600 hover:text-blue-600 w-full sm:w-auto"
            >
              Shop Now
            </Button>
          </div>
        }
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full"
      />
    </div>
  )
}

export default NotPermit
