import { useEffect } from 'react'
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Carousel,
  Badge,
  Rate,
  Tag,
  Avatar,
  Statistic
} from 'antd'
import {
  ArrowRightOutlined,
  ShoppingOutlined,
  TruckOutlined,
  FireOutlined,
  StarOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  TeamOutlined,
  GlobalOutlined,
  PhoneOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from 'redux/slices/productsSlice'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import ProductCard from 'components/card/product.card'

const { Title, Paragraph, Text } = Typography

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products } = useAppSelector((state) => state.products)

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, products.length])

  const featuredProducts = products.slice(0, 4)
  const newArrivals = products.slice(2, 6)
  const bestSellers = products.slice(1, 5)

  // Enhanced banner data with promotions
  const bannerSlides = [
    {
      id: 1,
      title: 'Summer Sale 2024',
      subtitle: 'Up to 70% OFF',
      description:
        'Discover amazing deals on electronics, fashion, and home essentials',
      buttonText: 'Shop Sale',
      buttonAction: () => navigate('/products'),
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop',
      badge: 'HOT DEAL'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh & Trendy',
      description: 'Check out the latest products from top brands worldwide',
      buttonText: 'Explore New',
      buttonAction: () => navigate('/products'),
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      image:
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=500&fit=crop',
      badge: 'NEW'
    },
    {
      id: 3,
      title: 'Premium Collection',
      subtitle: 'Luxury Redefined',
      description: 'Experience premium quality products with exclusive designs',
      buttonText: 'View Collection',
      buttonAction: () => navigate('/products'),
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      image:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop',
      badge: 'PREMIUM'
    }
  ]

  // Product categories
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      icon: <ThunderboltOutlined />,
      image:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
      count: '2,500+ items',
      color: '#1890ff'
    },
    {
      id: 2,
      name: 'Fashion',
      icon: <CrownOutlined />,
      image:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
      count: '1,800+ items',
      color: '#eb2f96'
    },
    {
      id: 3,
      name: 'Home & Garden',
      icon: <ShoppingOutlined />,
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      count: '3,200+ items',
      color: '#52c41a'
    },
    {
      id: 4,
      name: 'Sports',
      icon: <TrophyOutlined />,
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      count: '950+ items',
      color: '#fa8c16'
    },
    {
      id: 5,
      name: 'Books',
      icon: <StarOutlined />,
      image:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      count: '5,600+ items',
      color: '#722ed1'
    },
    {
      id: 6,
      name: 'Beauty',
      icon: <HeartOutlined />,
      image:
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
      count: '1,200+ items',
      color: '#f5222d'
    }
  ]

  // Promotions and offers
  const promotions = [
    {
      id: 1,
      title: 'Flash Sale',
      description: 'Limited time offer - 50% off selected items',
      discount: '50%',
      timeLeft: '2 days left',
      color: '#ff4d4f',
      icon: <FireOutlined />
    },
    {
      id: 2,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50',
      discount: 'FREE',
      timeLeft: 'Always available',
      color: '#52c41a',
      icon: <TruckOutlined />
    },
    {
      id: 3,
      title: 'Member Exclusive',
      description: 'Extra 20% off for VIP members',
      discount: '20%',
      timeLeft: 'This month',
      color: '#faad14',
      icon: <CrownOutlined />
    }
  ]

  // Customer reviews and testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment:
        'Amazing quality products and super fast delivery! Highly recommended.',
      product: 'Wireless Headphones'
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment:
        'Great customer service and excellent product selection. Will shop again!',
      product: 'Smart Watch'
    },
    {
      id: 3,
      name: 'Emily Davis',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment:
        'Best online shopping experience ever. Products exactly as described.',
      product: 'Running Shoes'
    }
  ]

  // Brand statistics
  const brandStats = [
    {
      title: 'Happy Customers',
      value: 50000,
      suffix: '+',
      icon: <TeamOutlined />
    },
    {
      title: 'Products Sold',
      value: 250000,
      suffix: '+',
      icon: <ShoppingOutlined />
    },
    {
      title: 'Countries Served',
      value: 25,
      suffix: '+',
      icon: <GlobalOutlined />
    },
    {
      title: 'Years Experience',
      value: 8,
      suffix: '+',
      icon: <TrophyOutlined />
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Enhanced Hero Banner/Carousel */}
      <div className="relative">
        <Carousel
          autoplay
          effect="fade"
          dots={true}
          arrows={true}
          className="hero-carousel"
          beforeChange={() => {}}
        >
          {bannerSlides.map((slide, index) => (
            <div key={slide.id}>
              <div
                className="relative flex h-96 items-center md:h-[500px] lg:h-[600px]"
                style={{ background: slide.background }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <Row align="middle" className="min-h-full">
                    <Col xs={24} lg={12}>
                      <div className="text-white space-y-6">
                        <Badge
                          count={slide.badge}
                          style={{
                            backgroundColor: '#ff4d4f',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '20px'
                          }}
                        />

                        <Title
                          level={1}
                          className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
                        >
                          {slide.title}
                        </Title>

                        <Title
                          level={2}
                          className="text-yellow-300 text-xl md:text-3xl mb-6"
                        >
                          {slide.subtitle}
                        </Title>

                        <Paragraph className="text-white text-lg md:text-xl mb-8 opacity-90 max-w-lg">
                          {slide.description}
                        </Paragraph>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            type="primary"
                            size="large"
                            icon={<ArrowRightOutlined />}
                            onClick={slide.buttonAction}
                            className="bg-white text-gray-800 border-white hover:bg-gray-100 h-12 px-8 text-lg font-medium"
                          >
                            {slide.buttonText}
                          </Button>
                          <Button
                            size="large"
                            icon={<PlayCircleOutlined />}
                            className="border-white text-gray-600 hover:bg-white hover:text-gray-800 h-12 px-8"
                          >
                            Watch Video
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Product Categories Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="text-3xl md:text-4xl font-bold mb-4">
              Shop by Category
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of product categories and find exactly what
              you're looking for
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {categories.map((category) => (
              <Col xs={12} sm={8} lg={4} key={category.id}>
                <Card
                  hoverable
                  className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group"
                  cover={
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ color: category.color }}
                      >
                        <div className="text-4xl opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                          {category.icon}
                        </div>
                      </div>
                    </div>
                  }
                  onClick={() => navigate('/products')}
                >
                  <div className="p-2">
                    <Title level={5} className="mb-1">
                      {category.name}
                    </Title>
                    <Text type="secondary" className="text-sm">
                      {category.count}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Promotions and Offers */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title
              level={2}
              className="text-white text-3xl md:text-4xl font-bold mb-4"
            >
              Special Offers & Promotions
            </Title>
            <Paragraph className="text-white text-lg opacity-90 max-w-2xl mx-auto">
              Don't miss out on these amazing deals and exclusive offers
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {promotions.map((promo) => (
              <Col xs={24} sm={8} key={promo.id}>
                <Card
                  className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden group"
                  style={{
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                  }}
                >
                  <div className="p-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white"
                      style={{ backgroundColor: promo.color }}
                    >
                      {promo.icon}
                    </div>

                    <Title level={3} className="mb-2">
                      {promo.title}
                    </Title>
                    <Paragraph className="text-gray-600 mb-4">
                      {promo.description}
                    </Paragraph>

                    <div className="mb-4">
                      <Text
                        className="text-3xl font-bold"
                        style={{ color: promo.color }}
                      >
                        {promo.discount}
                      </Text>
                      <Text className="text-lg ml-1">OFF</Text>
                    </div>

                    <Tag color={promo.color} className="mb-4">
                      {promo.timeLeft}
                    </Tag>

                    <Button
                      type="primary"
                      size="large"
                      style={{
                        backgroundColor: promo.color,
                        borderColor: promo.color
                      }}
                      className="w-full"
                      onClick={() => navigate('/products')}
                    >
                      Shop Now
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="text-3xl md:text-4xl font-bold mb-4">
              <FireOutlined className="text-red-500 mr-2" />
              Featured Products
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked products that our customers love the most
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} className="mb-8">
            {featuredProducts.map((product) => (
              <Col xs={24} sm={12} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          <div className="text-center">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/products')}
              className="px-8 h-12"
            >
              View All Featured Products
            </Button>
          </div>
        </div>
      </div>

      {/* New Arrivals & Best Sellers */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[48, 48]}>
            {/* New Arrivals */}
            <Col xs={24} lg={12}>
              <div className="text-center mb-8">
                <Title
                  level={2}
                  className="text-2xl md:text-3xl font-bold mb-4"
                >
                  <StarOutlined className="text-yellow-500 mr-2" />
                  New Arrivals
                </Title>
                <Paragraph className="text-gray-600">
                  Fresh products just added to our collection
                </Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                {newArrivals.slice(0, 4).map((product) => (
                  <Col xs={24} sm={12} key={product.id}>
                    <Card
                      hoverable
                      className="border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg"
                    >
                      <div className="flex gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Title level={5} className="mb-1" ellipsis>
                            {product.name}
                          </Title>
                          <Text type="secondary" className="text-sm block">
                            {product.category}
                          </Text>
                          <Text strong className="text-blue-600">
                            ${product.price}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>

            {/* Best Sellers */}
            <Col xs={24} lg={12}>
              <div className="text-center mb-8">
                <Title
                  level={2}
                  className="text-2xl md:text-3xl font-bold mb-4"
                >
                  <TrophyOutlined className="text-orange-500 mr-2" />
                  Best Sellers
                </Title>
                <Paragraph className="text-gray-600">
                  Most popular products loved by customers
                </Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                {bestSellers.slice(0, 4).map((product, index) => (
                  <Col xs={24} sm={12} key={product.id}>
                    <Card
                      hoverable
                      className="border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg"
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <Badge
                            count={`#${index + 1}`}
                            style={{ backgroundColor: '#faad14' }}
                            className="absolute -top-2 -right-2"
                          />
                        </div>
                        <div className="flex-1">
                          <Title level={5} className="mb-1" ellipsis>
                            {product.name}
                          </Title>
                          <Text type="secondary" className="text-sm block">
                            {product.category}
                          </Text>
                          <Text strong className="text-blue-600">
                            ${product.price}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real reviews from real customers who love shopping with us
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((testimonial) => (
              <Col xs={24} sm={8} key={testimonial.id}>
                <Card
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-full"
                  style={{
                    background:
                      'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                  }}
                >
                  <div className="text-center mb-4">
                    <Avatar
                      size={64}
                      src={testimonial.avatar}
                      className="mb-3"
                    />
                    <Title level={5} className="mb-1">
                      {testimonial.name}
                    </Title>
                    <Rate
                      disabled
                      defaultValue={testimonial.rating}
                      className="text-sm"
                    />
                  </div>

                  <Paragraph className="text-gray-600 text-center mb-4 italic">
                    "{testimonial.comment}"
                  </Paragraph>

                  <div className="text-center">
                    <Tag color="blue">{testimonial.product}</Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Brand Information & Statistics */}
      <div className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div>
                <Title
                  level={2}
                  className="text-white text-3xl md:text-4xl font-bold mb-6"
                >
                  About ShopHub
                </Title>
                <Paragraph className="text-gray-300 text-lg mb-6">
                  Since 2016, ShopHub has been your trusted partner in online
                  shopping. We're committed to providing high-quality products,
                  exceptional customer service, and an unmatched shopping
                  experience.
                </Paragraph>
                <Paragraph className="text-gray-300 text-lg mb-8">
                  Our mission is to make quality products accessible to
                  everyone, everywhere. With over 50,000 satisfied customers and
                  growing, we continue to innovate and improve our services.
                </Paragraph>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    className="bg-blue-600 border-blue-600 hover:bg-blue-700"
                  >
                    Learn More About Us
                  </Button>
                  <Button
                    size="large"
                    icon={<PhoneOutlined />}
                    className="border-white text-white hover:bg-white hover:text-gray-800"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <Row gutter={[24, 24]}>
                {brandStats.map((stat, index) => (
                  <Col xs={12} sm={6} lg={12} key={index}>
                    <Card
                      className="text-center border-0 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl"
                      style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <div className="text-3xl text-blue-400 mb-2">
                        {stat.icon}
                      </div>
                      <Statistic
                        title={
                          <span className="text-gray-300 text-sm">
                            {stat.title}
                          </span>
                        }
                        value={stat.value}
                        suffix={
                          <span className="text-white">{stat.suffix}</span>
                        }
                        valueStyle={{
                          color: '#ffffff',
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title
            level={2}
            className="text-white text-3xl md:text-4xl font-bold mb-4"
          >
            Stay Updated with Our Latest Offers
          </Title>
          <Paragraph className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new
            products, exclusive deals, and special promotions.
          </Paragraph>

          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="outline-none flex-1 px-4 py-2 rounded-lg border-0 text-gray-800 text-lg"
              />
              <Button
                type="primary"
                size="large"
                className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-gray-800 font-medium px-8 py-6"
              >
                Subscribe
              </Button>
            </div>
            <Text className="text-blue-100 text-sm mt-2 block">
              We respect your privacy. Unsubscribe at any time.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
