import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, InputNumber, Rate, Tabs, Card, Image, Badge, Form, Input, Avatar, Upload, message, Modal, Progress, Tag } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, ArrowLeftOutlined, CheckCircleOutlined, TruckOutlined, SafetyOutlined, UserOutlined, LikeOutlined, DislikeOutlined, CameraOutlined, SendOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { addToCart } from '../../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from 'store/hook';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(state => state.products);
  const { userInfo } = useAppSelector(state => state.user);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Review system state
  const [reviews, setReviews] = useState([]);
  const [reviewForm] = Form.useForm();
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [sortReviews, setSortReviews] = useState('newest'); // newest, oldest, helpful

  // Mock reviews data - in real app, this would come from API
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        userId: 'user1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        title: 'Excellent product!',
        comment: 'This product exceeded my expectations. The quality is outstanding and delivery was super fast. Highly recommend to anyone looking for this type of product.',
        date: '2024-01-15',
        helpful: 12,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'],
        verified: true,
        likes: 8,
        dislikes: 0
      },
      {
        id: 2,
        userId: 'user2',
        userName: 'Mike Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        rating: 4,
        title: 'Good value for money',
        comment: 'Pretty good product overall. Works as expected and the price is reasonable. Only minor issue is the packaging could be better.',
        date: '2024-01-10',
        helpful: 8,
        images: [],
        verified: true,
        likes: 5,
        dislikes: 1
      },
      {
        id: 3,
        userId: 'user3',
        userName: 'Emily Davis',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        title: 'Perfect!',
        comment: 'Exactly what I was looking for. Great quality, fast shipping, and excellent customer service. Will definitely buy again!',
        date: '2024-01-08',
        helpful: 15,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'],
        verified: true,
        likes: 12,
        dislikes: 0
      }
    ];
    setReviews(mockReviews);
  }, []);

  // Find product by ID
  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (!product && products.length > 0) {
      navigate('/products');
    }
  }, [product, products, navigate]);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        <div className="text-center py-16">
          <Title level={3}>Product not found</Title>
          <Button type="primary" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate('/cart');
  };

  // Review handling functions
  const handleSubmitReview = async (values) => {
    if (!userInfo) {
      message.error('Please login to submit a review');
      return;
    }

    setSubmittingReview(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle both quick form and detailed modal form
      const reviewTitle = values.title || values.quickTitle;
      const reviewComment = values.comment || values.quickComment;
      
      const newReview = {
        id: Date.now(),
        userId: userInfo.id || 'current-user',
        userName: userInfo.name || 'Anonymous User',
        userAvatar: userInfo.avatar || null,
        rating: userRating,
        title: reviewTitle,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        images: reviewImages,
        verified: true,
        likes: 0,
        dislikes: 0
      };

      if (editingReview) {
        setReviews(prev => prev.map(review => 
          review.id === editingReview.id ? { ...newReview, id: editingReview.id } : review
        ));
        message.success('Review updated successfully!');
      } else {
        setReviews(prev => [newReview, ...prev]);
        message.success('Review submitted successfully!');
      }

      // Reset forms
      reviewForm.resetFields();
      // Reset quick form if it exists
      const quickForm = document.querySelector('.quick-review-form');
      if (quickForm) {
        quickForm.reset();
      }
      setUserRating(0);
      setReviewImages([]);
      setShowReviewModal(false);
      setEditingReview(null);
      
      // Scroll to reviews section to show the new review
      setTimeout(() => {
        const reviewsSection = document.querySelector('.ant-tabs-tabpane-active');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
      
    } catch (error) {
      message.error('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setUserRating(review.rating);
    reviewForm.setFieldsValue({
      title: review.title,
      comment: review.comment
    });
    setReviewImages(review.images || []);
    setShowReviewModal(true);
  };

  const handleDeleteReview = (reviewId) => {
    Modal.confirm({
      title: 'Delete Review',
      content: 'Are you sure you want to delete this review?',
      onOk: () => {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        message.success('Review deleted successfully');
      }
    });
  };

  const handleLikeReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const handleDislikeReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, dislikes: review.dislikes + 1 }
        : review
    ));
  };

  const handleImageUpload = ({ fileList }) => {
    setReviewImages(fileList.map(file => file.url || file.thumbUrl));
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (reviewFilter === 'all') return true;
      return review.rating === parseInt(reviewFilter);
    })
    .sort((a, b) => {
      switch (sortReviews) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'helpful':
          return (b.likes - b.dislikes) - (a.likes - a.dislikes);
        case 'newest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  // Calculate review statistics
  const reviewStats = {
    total: reviews.length,
    average: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    distribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  };

  // Mock additional images
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const features = [
    'High Quality Materials',
    'Fast Shipping Available',
    '30-Day Return Policy',
    'Warranty Included',
    'Customer Support 24/7'
  ];

  const specifications = {
    'Brand': product.category || 'Premium Brand',
    'Model': `${product.name} - ${product.id}`,
    'Weight': '2.5 lbs',
    'Dimensions': '10 x 8 x 6 inches',
    'Material': 'Premium Quality',
    'Color': 'Multiple Options',
    'Warranty': '1 Year Limited'
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/products')}
          className="mb-4 mr-3"
        >
          Back to Products
        </Button>
        <Text type="secondary">
          Products / {product.category} / {product.name}
        </Text>
      </div>

      <Row gutter={[32, 32]}>
        {/* Product Images */}
        <Col xs={24} lg={12}>
          <div className="sticky top-6">
            <div className="mb-4">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full rounded-xl"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Product Info */}
        <Col xs={24} lg={12}>
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <Text type="secondary" className="text-sm uppercase tracking-wide">
                {product.category}
              </Text>
              <Title level={1} className="mb-2">{product.name}</Title>

              <div className="flex items-center gap-4 mb-4">
                <Rate disabled defaultValue={product.rating || 4.5} />
                <Text type="secondary">({product.reviews || 128} reviews)</Text>
                <Badge
                  count={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  style={{ backgroundColor: product.stock > 0 ? '#52c41a' : '#ff4d4f' }}
                />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Title level={2} className="text-blue-600 m-0">
                  ${product.price}
                </Title>
                {product.originalPrice && (
                  <Text delete className="text-gray-400 text-lg">
                    ${product.originalPrice}
                  </Text>
                )}
                {product.discount && (
                  <Badge count={`-${product.discount}%`} style={{ backgroundColor: '#ff4d4f' }} />
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Paragraph className="text-gray-600 text-base leading-relaxed">
                {product.description || 'This is a premium quality product designed to meet your needs. Crafted with attention to detail and built to last, it offers exceptional value and performance.'}
              </Paragraph>
            </div>

            {/* Features */}
            <div>
              <Title level={4}>Key Features</Title>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" />
                    <Text>{feature}</Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Options */}
            <Card className="rounded-xl bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Text strong>Quantity:</Text>
                  <InputNumber
                    min={1}
                    max={product.stock || 10}
                    value={quantity}
                    onChange={setQuantity}
                    size="large"
                  />
                  <Text type="secondary">
                    {product.stock || 10} available
                  </Text>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="large"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="flex-1 bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button icon={<HeartOutlined />} className="flex-1">
                    Add to Wishlist
                  </Button>
                  <Button icon={<ShareAltOutlined />} className="flex-1">
                    Share
                  </Button>
                </div>
              </div>
            </Card>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TruckOutlined className="text-2xl text-blue-600 mb-2" />
                <Text strong className="block">Free Shipping</Text>
                <Text type="secondary" className="text-sm">On orders over $50</Text>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <SafetyOutlined className="text-2xl text-green-600 mb-2" />
                <Text strong className="block">Secure Payment</Text>
                <Text type="secondary" className="text-sm">SSL encrypted</Text>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <CheckCircleOutlined className="text-2xl text-orange-600 mb-2" />
                <Text strong className="block">Easy Returns</Text>
                <Text type="secondary" className="text-sm">30-day policy</Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Description" key="1">
            <div className="py-6">
              <Title level={3}>Product Description</Title>
              <Paragraph className="text-base leading-relaxed">
                {product.description || 'This premium product is designed with the highest quality materials and craftsmanship. It offers exceptional performance, durability, and value for money. Whether you\'re a professional or enthusiast, this product will exceed your expectations.'}
              </Paragraph>
              <Paragraph className="text-base leading-relaxed">
                Our commitment to quality ensures that every product meets rigorous standards before reaching our customers. With attention to detail and innovative design, this product represents the perfect balance of functionality and style.
              </Paragraph>
            </div>
          </TabPane>

          <TabPane tab="Specifications" key="2">
            <div className="py-6">
              <Title level={3}>Technical Specifications</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <Text strong>{key}:</Text>
                    <Text>{value}</Text>
                  </div>
                ))}
              </div>
            </div>
          </TabPane>

          <TabPane tab={`Reviews (${reviewStats.total})`} key="3">
            <div className="py-6">
              {/* Review Statistics */}
              <div className="mb-8">
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <Card className="text-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {reviewStats.average.toFixed(1)}
                      </div>
                      <Rate disabled value={reviewStats.average} allowHalf className="mb-2" />
                      <Text type="secondary">Based on {reviewStats.total} reviews</Text>
                    </Card>
                  </Col>
                  <Col xs={24} md={16}>
                    <Card className="rounded-xl">
                      <Title level={5} className="mb-4">Rating Distribution</Title>
                      {[5, 4, 3, 2, 1].map(rating => (
                        <div key={rating} className="flex items-center gap-3 mb-2">
                          <Text className="w-8">{rating}</Text>
                          <Rate disabled value={1} count={1} className="text-sm" />
                          <Progress 
                            percent={reviewStats.total > 0 ? (reviewStats.distribution[rating] / reviewStats.total) * 100 : 0}
                            strokeColor="#1890ff"
                            className="flex-1"
                            size="small"
                          />
                          <Text type="secondary" className="w-8 text-right">
                            {reviewStats.distribution[rating]}
                          </Text>
                        </div>
                      ))}
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Quick Review Input */}
              <Card className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <Title level={4} className="mb-4 text-blue-800">
                  Share Your Experience
                </Title>
                
                <Form
                  layout="vertical"
                  onFinish={handleSubmitReview}
                  className="quick-review-form"
                >
                  {/* Quick Rating */}
                  <div className="mb-4">
                    <Text strong className="block mb-2">Rate this product:</Text>
                    <div className="flex items-center gap-4">
                      <Rate
                        value={userRating}
                        onChange={setUserRating}
                        className="text-xl"
                        character="⭐"
                      />
                      <Text type="secondary" className="text-sm">
                        {userRating === 0 && "Click to rate"}
                        {userRating === 1 && "Poor"}
                        {userRating === 2 && "Fair"}
                        {userRating === 3 && "Good"}
                        {userRating === 4 && "Very Good"}
                        {userRating === 5 && "Excellent"}
                      </Text>
                    </div>
                  </div>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="quickTitle"
                        rules={[
                          { required: true, message: 'Please enter a title' },
                          { max: 100, message: 'Title too long' }
                        ]}
                      >
                        <Input
                          placeholder="Review title (e.g., Great product!)"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="quickComment"
                        rules={[
                          { required: true, message: 'Please write your review' },
                          { min: 10, message: 'Please write at least 10 characters' }
                        ]}
                      >
                        <Input.TextArea
                          placeholder="Write your review here... What did you like about this product?"
                          rows={3}
                          className="rounded-lg"
                          showCount
                          maxLength={500}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                      <div className="flex flex-col gap-2 h-full">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submittingReview}
                          disabled={userRating === 0}
                          icon={<SendOutlined />}
                          className="rounded-lg flex-1"
                          size="large"
                        >
                          Submit
                        </Button>
                        <Button
                          type="default"
                          onClick={() => setShowReviewModal(true)}
                          icon={<EditOutlined />}
                          className="rounded-lg"
                          size="small"
                        >
                          Detailed Review
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  {!userInfo && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Text type="warning" className="text-sm">
                        Please <Button type="link" onClick={() => navigate('/login')} className="p-0 h-auto">login</Button> to submit a review
                      </Text>
                    </div>
                  )}
                </Form>
              </Card>

              {/* Review Filters and Sort */}
              <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Text strong>Filter by rating:</Text>
                  <Button.Group>
                    <Button 
                      type={reviewFilter === 'all' ? 'primary' : 'default'}
                      onClick={() => setReviewFilter('all')}
                      size="small"
                    >
                      All
                    </Button>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <Button 
                        key={rating}
                        type={reviewFilter === rating.toString() ? 'primary' : 'default'}
                        onClick={() => setReviewFilter(rating.toString())}
                        size="small"
                      >
                        {rating} ⭐
                      </Button>
                    ))}
                  </Button.Group>
                </div>
                
                <div className="flex items-center gap-2">
                  <Text strong>Sort by:</Text>
                  <Button.Group>
                    <Button 
                      type={sortReviews === 'newest' ? 'primary' : 'default'}
                      onClick={() => setSortReviews('newest')}
                      size="small"
                    >
                      Newest
                    </Button>
                    <Button 
                      type={sortReviews === 'oldest' ? 'primary' : 'default'}
                      onClick={() => setSortReviews('oldest')}
                      size="small"
                    >
                      Oldest
                    </Button>
                    <Button 
                      type={sortReviews === 'helpful' ? 'primary' : 'default'}
                      onClick={() => setSortReviews('helpful')}
                      size="small"
                    >
                      Most Helpful
                    </Button>
                  </Button.Group>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {filteredAndSortedReviews.length === 0 ? (
                  <Card className="text-center py-8 rounded-xl">
                    <Text type="secondary" className="text-lg">
                      No reviews found for the selected filters.
                    </Text>
                  </Card>
                ) : (
                  filteredAndSortedReviews.map(review => (
                    <Card key={review.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <Avatar 
                          src={review.userAvatar} 
                          icon={<UserOutlined />}
                          size={48}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Text strong className="text-base">{review.userName}</Text>
                                {review.verified && (
                                  <Tag color="green" className="text-xs">Verified Purchase</Tag>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <Rate disabled value={review.rating} size="small" />
                                <Text type="secondary" className="text-sm">{review.date}</Text>
                              </div>
                            </div>
                            {userInfo && userInfo.id === review.userId && (
                              <div className="flex gap-1">
                                <Button 
                                  type="text" 
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditReview(review)}
                                />
                                <Button 
                                  type="text" 
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteReview(review.id)}
                                />
                              </div>
                            )}
                          </div>
                          
                          {review.title && (
                            <Title level={5} className="mb-2">{review.title}</Title>
                          )}
                          
                          <Paragraph className="mb-3 text-gray-700">
                            {review.comment}
                          </Paragraph>
                          
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.images.map((img, index) => (
                                <Image
                                  key={index}
                                  src={img}
                                  alt={`Review image ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover"
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4">
                            <Button 
                              type="text" 
                              size="small"
                              icon={<LikeOutlined />}
                              onClick={() => handleLikeReview(review.id)}
                              className="text-gray-500 hover:text-green-600"
                            >
                              Helpful ({review.likes})
                            </Button>
                            <Button 
                              type="text" 
                              size="small"
                              icon={<DislikeOutlined />}
                              onClick={() => handleDislikeReview(review.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              Not Helpful ({review.dislikes})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* Review Modal */}
      <Modal
        title={editingReview ? "Edit Your Review" : "Write a Review"}
        open={showReviewModal}
        onCancel={() => {
          setShowReviewModal(false);
          setEditingReview(null);
          reviewForm.resetFields();
          setUserRating(0);
          setReviewImages([]);
        }}
        footer={null}
        width={600}
        className="review-modal"
      >
        <div className="py-4">
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleSubmitReview}
            requiredMark={false}
          >
            {/* Rating */}
            <Form.Item
              label="Your Rating"
              required
              className="mb-6"
            >
              <div className="text-center">
                <Rate
                  value={userRating}
                  onChange={setUserRating}
                  className="text-3xl mb-2"
                  character="⭐"
                />
                <div className="text-sm text-gray-500">
                  {userRating === 0 && "Click to rate"}
                  {userRating === 1 && "Poor"}
                  {userRating === 2 && "Fair"}
                  {userRating === 3 && "Good"}
                  {userRating === 4 && "Very Good"}
                  {userRating === 5 && "Excellent"}
                </div>
              </div>
            </Form.Item>

            {/* Review Title */}
            <Form.Item
              label="Review Title"
              name="title"
              rules={[
                { required: true, message: 'Please enter a review title' },
                { max: 100, message: 'Title must be less than 100 characters' }
              ]}
            >
              <Input
                placeholder="Summarize your experience in a few words"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            {/* Review Comment */}
            <Form.Item
              label="Your Review"
              name="comment"
              rules={[
                { required: true, message: 'Please write your review' },
                { min: 10, message: 'Review must be at least 10 characters' },
                { max: 1000, message: 'Review must be less than 1000 characters' }
              ]}
            >
              <Input.TextArea
                placeholder="Share your experience with this product. What did you like or dislike? How did it meet your expectations?"
                rows={6}
                className="rounded-lg"
                showCount
                maxLength={1000}
              />
            </Form.Item>

            {/* Image Upload */}
            <Form.Item
              label="Add Photos (Optional)"
              className="mb-6"
            >
              <Upload
                listType="picture-card"
                fileList={reviewImages.map((url, index) => ({
                  uid: index,
                  name: `image-${index}`,
                  status: 'done',
                  url: url,
                  thumbUrl: url
                }))}
                onChange={handleImageUpload}
                beforeUpload={() => false} // Prevent auto upload
                maxCount={5}
                className="review-upload"
              >
                <div className="text-center">
                  <CameraOutlined className="text-2xl text-gray-400 mb-2" />
                  <div className="text-sm text-gray-500">Upload Photos</div>
                </div>
              </Upload>
              <div className="text-xs text-gray-500 mt-2">
                Add up to 5 photos to help other customers see how the product looks
              </div>
            </Form.Item>

            {/* Guidelines */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Title level={5} className="text-blue-800 mb-2">Review Guidelines</Title>
              <ul className="text-sm text-blue-700 space-y-1 mb-0 ml-4">
                <li>Be honest and helpful to other customers</li>
                <li>Focus on the product features and your experience</li>
                <li>Avoid inappropriate language or personal information</li>
                <li>Include specific details about quality, fit, or performance</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <Button
                size="large"
                onClick={() => {
                  setShowReviewModal(false);
                  setEditingReview(null);
                  reviewForm.resetFields();
                  setUserRating(0);
                  setReviewImages([]);
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={submittingReview}
                disabled={userRating === 0}
                icon={<SendOutlined />}
                className="px-6 rounded-lg"
              >
                {submittingReview 
                  ? (editingReview ? 'Updating...' : 'Submitting...') 
                  : (editingReview ? 'Update Review' : 'Submit Review')
                }
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;