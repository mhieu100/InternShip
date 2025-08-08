import { useEffect, useState, useCallback } from 'react';
import { Card, Typography, Button, Select, Input, Slider, Checkbox, Spin, Empty, Badge, Rate, Drawer, Space, Divider, Tag, Pagination, Tooltip, AutoComplete, Progress } from 'antd';
import { SearchOutlined, FilterOutlined, AppstoreOutlined, BarsOutlined, ShoppingCartOutlined, HeartOutlined, EyeOutlined, ClearOutlined, SortAscendingOutlined, DownOutlined, StarOutlined, FireOutlined } from '@ant-design/icons';
import { fetchProducts, setSearchTerm, setCategory, setPriceRange } from '../../store/slices/productsSlice';
import { addToCart } from '../../store/slices/cartSlice';

import { useNavigate } from 'react-router-dom';
import ProductCard from 'components/layout/client/card/product.card';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { IProduct } from 'types/backend';

const { Title, Text } = Typography;
const { Option } = Select;

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, searchTerm, category, priceRange } = useAppSelector(state => state.products);
  
  // Enhanced state management
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minRating, setMinRating] = useState(0);
  
  // Pagination and loading
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [paginationType, setPaginationType] = useState('pagination'); // 'pagination', 'loadMore', 'infinite'
  
  // Search enhancements
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState({
    inName: true,
    inDescription: true,
    inCategory: false,
    exactMatch: false
  });

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const suggestions = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(p => ({ value: p.name, label: p.name }))
        .slice(0, 8);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, products]);

  // Enhanced filtering logic
  const filteredProducts = products
    .filter(product => {
      // Enhanced search logic
      let matchesSearch = true;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = advancedSearch.inName && product.name?.toLowerCase().includes(searchLower);
        const descMatch = advancedSearch.inDescription && product.description?.toLowerCase().includes(searchLower);
        const catMatch = advancedSearch.inCategory && product.category?.toLowerCase().includes(searchLower);
        
        if (advancedSearch.exactMatch) {
          matchesSearch = product.name?.toLowerCase() === searchLower;
        } else {
          matchesSearch = nameMatch || descMatch || catMatch;
        }
      }

      const matchesCategory = !category || product.category === category;
      const matchesPrice = (product.price ?? 0) >= priceRange[0] && (product.price ?? 0) <= priceRange[1];
      const matchesRating = (product.rating || 0) >= minRating;
      
      // Enhanced features matching
      const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.every(feature => {
        switch (feature) {
          case 'free-shipping': return product.price >= 50;
          case 'on-sale': return product.originalPrice && product.originalPrice > product.price;
          case 'in-stock': return product.stock > 0;
          case 'highly-rated': return (product.rating || 0) >= 4.0;
          case 'new-arrival': return product.isNew || false;
          case 'best-seller': return product.isBestSeller || false;
          default: return true;
        }
      });

      const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand || product.category);
      const matchesColors = selectedColors.length === 0 || selectedColors.some(color => 
        product.colors?.includes(color) || product.color === color
      );
      const matchesSizes = selectedSizes.length === 0 || selectedSizes.some(size => 
        product.sizes?.includes(size) || product.size === size
      );

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && 
             matchesFeatures && matchesBrands && matchesColors && matchesSizes;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'newest': return new Date(b.created || Date.now()) - new Date(a.created || Date.now());
        case 'popularity': return (b.reviews || 0) - (a.reviews || 0);
        case 'discount': return (b.discount || 0) - (a.discount || 0);
        case 'alphabetical': return a.name?.localeCompare(b.name) || 0;
        case 'relevance': 
          if (searchTerm) {
            const aScore = (a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
                          (a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0);
            const bScore = (b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
                          (b.description?.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0);
            return bScore - aScore;
          }
          return 0;
        case 'name': 
        default: return a.name?.localeCompare(b.name) || 0;
      }
    });

  // Extract unique values for filters
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const brands = [...new Set(products.map(p => p.brand || p.category))].filter(Boolean);
  const colors = [...new Set(products.flatMap(p => p.colors || [p.color]).filter(Boolean))];
  const sizes = [...new Set(products.flatMap(p => p.sizes || [p.size]).filter(Boolean))];

  // Pagination logic
  const totalProducts = filteredProducts.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = paginationType === 'pagination' 
    ? filteredProducts.slice(startIndex, endIndex)
    : filteredProducts.slice(0, currentPage * pageSize);
  
  const activeFiltersCount = [
    category,
    searchTerm,
    priceRange[0] > 0 || priceRange[1] < 1000,
    minRating > 0,
    selectedFeatures.length > 0,
    selectedBrands.length > 0,
    selectedColors.length > 0,
    selectedSizes.length > 0
  ].filter(Boolean).length;

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setCategory(value));
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    dispatch(setPriceRange(range));
  };

  const handleFeatureChange = (checkedValues: string[]) => {
    setSelectedFeatures(checkedValues);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleBrandChange = (checkedValues: string[]) => {
    setSelectedBrands(checkedValues);
    setCurrentPage(1);
  };

  const handleColorChange = (checkedValues: string[]) => {
    setSelectedColors(checkedValues);
    setCurrentPage(1);
  };

  const handleSizeChange = (checkedValues: string[]) => {
    setSelectedSizes(checkedValues);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: IProduct) => {
    dispatch(addToCart(product));
  };

  const clearAllFilters = () => {
    dispatch(setSearchTerm(''));
    dispatch(setCategory(''));
    dispatch(setPriceRange([0, 1000]));
    setMinRating(0);
    setSelectedFeatures([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setCurrentPage(1);
  };

  const handleProductView = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page : number, size : number) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(prev => prev + 1);
    setLoadingMore(false);
  }, [loadingMore]);

  const handleInfiniteScroll = useCallback(() => {
    if (paginationType !== 'infinite') return;
    
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingMore && paginatedProducts.length < totalProducts) {
      handleLoadMore();
    }
  }, [paginationType, loadingMore, paginatedProducts.length, totalProducts, handleLoadMore]);

  useEffect(() => {
    if (paginationType === 'infinite') {
      window.addEventListener('scroll', handleInfiniteScroll);
      return () => window.removeEventListener('scroll', handleInfiniteScroll);
    }
  }, [handleInfiniteScroll, paginationType]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
        <div className="flex justify-center items-center min-h-96">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <Title level={1} className="mb-2">Our Products</Title>
          <Text type="secondary" className="text-lg">
            Discover our amazing collection of {products.length} premium products
          </Text>
          {activeFiltersCount > 0 && (
            <div className="mt-4">
              <Tag color="blue" className="text-sm">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </Tag>
              <Button 
                type="link" 
                size="small" 
                icon={<ClearOutlined />}
                onClick={clearAllFilters}
                className="ml-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-6 rounded-xl shadow-sm border-0">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-lg">
              <AutoComplete
                options={searchSuggestions}
                onSelect={(value) => dispatch(setSearchTerm(value))}
                onSearch={(value) => dispatch(setSearchTerm(value))}
                value={searchTerm}
                className="w-full"
              >
                <Input.Search
                  placeholder="Search products by name, description, or category..."
                  allowClear
                  enterButton={
                    <Button type="primary" icon={<SearchOutlined />}>
                      Search
                    </Button>
                  }
                  size="large"
                  onSearch={handleSearch}
                  className="shadow-sm"
                  suffix={
                    <Tooltip title="Advanced search options">
                      <Button 
                        type="text" 
                        size="small"
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <DownOutlined />
                      </Button>
                    </Tooltip>
                  }
                />
              </AutoComplete>
              
              {/* Advanced Search Options */}
              {showFilters && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <Text className="text-sm text-gray-600 block mb-2">Search in:</Text>
                  <div className="flex flex-wrap gap-2">
                    <Checkbox 
                      checked={advancedSearch.inName}
                      onChange={(e) => setAdvancedSearch(prev => ({...prev, inName: e.target.checked}))}
                    >
                      Product Name
                    </Checkbox>
                    <Checkbox 
                      checked={advancedSearch.inDescription}
                      onChange={(e) => setAdvancedSearch(prev => ({...prev, inDescription: e.target.checked}))}
                    >
                      Description
                    </Checkbox>
                    <Checkbox 
                      checked={advancedSearch.inCategory}
                      onChange={(e) => setAdvancedSearch(prev => ({...prev, inCategory: e.target.checked}))}
                    >
                      Category
                    </Checkbox>
                    <Checkbox 
                      checked={advancedSearch.exactMatch}
                      onChange={(e) => setAdvancedSearch(prev => ({...prev, exactMatch: e.target.checked}))}
                    >
                      Exact Match
                    </Checkbox>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <Select
                placeholder="All Categories"
                allowClear
                style={{ width: 160 }}
                onChange={handleCategoryChange}
                value={category}
                className="shadow-sm"
              >
                {categories.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
              
              <Select
                placeholder="Sort by"
                style={{ width: 200 }}
                value={sortBy}
                onChange={handleSortChange}
                suffixIcon={<SortAscendingOutlined />}
                className="shadow-sm"
              >
                <Option value="relevance">
                  <FireOutlined className="mr-1" />
                  Relevance
                </Option>
                <Option value="popularity">
                  <StarOutlined className="mr-1" />
                  Most Popular
                </Option>
                <Option value="newest">Newest First</Option>
                <Option value="price-low">Price: Low to High</Option>
                <Option value="price-high">Price: High to Low</Option>
                <Option value="rating">Highest Rated</Option>
                <Option value="discount">Best Discount</Option>
                <Option value="alphabetical">Name A-Z</Option>
              </Select>

              <Select
                placeholder="Show"
                style={{ width: 100 }}
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                className="shadow-sm"
              >
                <Option value={12}>12</Option>
                <Option value={24}>24</Option>
                <Option value={48}>48</Option>
                <Option value={96}>96</Option>
              </Select>

              <Select
                placeholder="View Type"
                style={{ width: 140 }}
                value={paginationType}
                onChange={setPaginationType}
                className="shadow-sm"
              >
                <Option value="pagination">Pagination</Option>
                <Option value="loadMore">Load More</Option>
                <Option value="infinite">Infinite Scroll</Option>
              </Select>
              
              <Badge count={activeFiltersCount} size="small">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => {
                    // On desktop, toggle inline filters
                    if (window.innerWidth >= 1024) {
                      setShowFilters(!showFilters);
                    } else {
                      // On mobile, open drawer
                      setMobileFiltersVisible(!mobileFiltersVisible);
                    }
                  }}
                  className={`shadow-sm ${(showFilters || mobileFiltersVisible) ? 'bg-blue-50 border-blue-300 text-blue-600' : ''}`}
                >
                  <span className="hidden sm:inline">Filters</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
              </Badge>
              
              <Divider type="vertical" className="h-8" />
              
              <Space.Compact>
                <Button
                  icon={<AppstoreOutlined />}
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                  className="shadow-sm"
                />
                <Button
                  icon={<BarsOutlined />}
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                  className="shadow-sm"
                />
              </Space.Compact>
            </div>
          </div>
        
          {/* Enhanced Desktop Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 hidden lg:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="block mb-3 text-gray-700">Price Range</Text>
                  <Slider
                    range
                    min={0}
                    max={1000}
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    marks={{
                      0: '$0',
                      250: '$250',
                      500: '$500',
                      750: '$750',
                      1000: '$1000+'
                    }}
                    className="mb-4"
                  />
                  <div className="text-center text-sm text-gray-500 bg-white px-2 py-1 rounded">
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="block mb-3 text-gray-700">Minimum Rating</Text>
                  <div className="space-y-3">
                    <div className="bg-white p-2 rounded">
                      <Rate 
                        value={minRating} 
                        onChange={setMinRating} 
                        allowHalf 
                        className="text-sm"
                      />
                      <Text type="secondary" className="block text-xs mt-1">
                        {minRating > 0 ? `${minRating}+ stars` : 'Any rating'}
                      </Text>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="block mb-3 text-gray-700">Features</Text>
                  <Checkbox.Group 
                    value={selectedFeatures} 
                    onChange={handleFeatureChange}
                    className="flex flex-col space-y-2"
                  >
                    <Checkbox value="free-shipping" className="text-sm bg-white px-2 py-1 rounded hover:bg-blue-50">
                      <div className="flex flex-col">
                        <span>Free Shipping</span>
                        <Text type="secondary" className="text-xs">Orders $50+</Text>
                      </div>
                    </Checkbox>
                    <Checkbox value="on-sale" className="text-sm bg-white px-2 py-1 rounded hover:bg-blue-50">
                      <div className="flex flex-col">
                        <span>On Sale</span>
                        <Text type="secondary" className="text-xs">Discounted</Text>
                      </div>
                    </Checkbox>
                    <Checkbox value="in-stock" className="text-sm bg-white px-2 py-1 rounded hover:bg-blue-50">
                      <div className="flex flex-col">
                        <span>In Stock</span>
                        <Text type="secondary" className="text-xs">Available</Text>
                      </div>
                    </Checkbox>
                    <Checkbox value="highly-rated" className="text-sm bg-white px-2 py-1 rounded hover:bg-blue-50">
                      <div className="flex flex-col">
                        <span>Highly Rated</span>
                        <Text type="secondary" className="text-xs">4.0+ stars</Text>
                      </div>
                    </Checkbox>
                  </Checkbox.Group>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="block mb-3 text-gray-700">Brands</Text>
                  <Checkbox.Group 
                    value={selectedBrands} 
                    onChange={handleBrandChange}
                    className="flex flex-col space-y-2"
                  >
                    {brands.map(brand => (
                      <Checkbox key={brand} value={brand} className="text-sm bg-white px-2 py-1 rounded hover:bg-blue-50">
                        {brand}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="block mb-3 text-gray-700">Colors</Text>
                  <Checkbox.Group 
                    value={selectedColors} 
                    onChange={handleColorChange}
                    className="flex flex-col space-y-2"
                  >
                    {colors.map(color => (
                      <Checkbox key={color} value={color} className="text-sm bg-white px-2 py-1 rounded hover:bg-blue-50">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                          ></div>
                          <span className="capitalize">{color}</span>
                        </div>
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="block mb-3 text-gray-700">Sizes</Text>
                  <Checkbox.Group 
                    value={selectedSizes} 
                    onChange={handleSizeChange}
                    className="flex flex-wrap gap-2"
                  >
                    {sizes.map(size => (
                      <Checkbox key={size} value={size}>
                        <Tag 
                          className={`cursor-pointer ${selectedSizes.includes(size) ? 'bg-blue-100 border-blue-400' : ''}`}
                        >
                          {size}
                        </Tag>
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Text strong className="block mb-3 text-blue-800">Filter Summary</Text>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded text-center">
                      <Text className="text-lg font-bold text-blue-600">
                        {filteredProducts.length}
                      </Text>
                      <Text type="secondary" className="block text-xs">
                        product{filteredProducts.length !== 1 ? 's' : ''} found
                      </Text>
                    </div>
                    <Button 
                      type="primary" 
                      size="small" 
                      onClick={clearAllFilters}
                      icon={<ClearOutlined />}
                      className="w-full"
                      danger
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </Card>

        {/* Enhanced Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Text className="text-lg font-medium text-gray-700">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </Text>
            {products.length !== filteredProducts.length && (
              <Text type="secondary" className="block text-sm">
                out of {products.length} total products
              </Text>
            )}
          </div>
          {searchTerm && (
            <div className="flex items-center gap-2">
              <Text type="secondary" className="text-sm">Results for:</Text>
              <Tag color="blue" className="text-sm">"{searchTerm}"</Tag>
            </div>
          )}
        </div>

        {/* Enhanced Mobile Filter Drawer */}
        <Drawer
          title={
            <div className="flex items-center justify-between">
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge count={activeFiltersCount} size="small" />
              )}
            </div>
          }
          placement="right"
          onClose={() => setMobileFiltersVisible(false)}
          open={mobileFiltersVisible}
          width={350}
          className="lg:hidden"
          footer={
            <div className="flex gap-2">
              <Button 
                onClick={clearAllFilters} 
                className="flex-1"
                icon={<ClearOutlined />}
              >
                Clear All
              </Button>
              <Button 
                type="primary" 
                onClick={() => setMobileFiltersVisible(false)}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <Text strong className="block mb-3 text-gray-700">Category</Text>
              <Select
                placeholder="All Categories"
                allowClear
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                value={category}
                size="large"
              >
                {categories.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </div>
            
            <Divider />
            
            {/* Price Range */}
            <div>
              <Text strong className="block mb-3 text-gray-700">Price Range</Text>
              <Slider
                range
                min={0}
                max={1000}
                value={priceRange}
                onChange={handlePriceRangeChange}
                marks={{
                  0: '$0',
                  250: '$250',
                  500: '$500',
                  750: '$750',
                  1000: '$1000+'
                }}
                className="mb-4"
              />
              <div className="text-center text-sm text-gray-500">
                ${priceRange[0]} - ${priceRange[1]}
              </div>
            </div>
            
            <Divider />
            
            {/* Rating Filter */}
            <div>
              <Text strong className="block mb-3 text-gray-700">Minimum Rating</Text>
              <div className="space-y-2">
                <Rate 
                  value={minRating} 
                  onChange={setMinRating} 
                  allowHalf 
                  className="text-lg"
                />
                <Text type="secondary" className="block text-sm">
                  {minRating > 0 ? `${minRating}+ stars` : 'Any rating'}
                </Text>
              </div>
            </div>
            
            <Divider />
            
            {/* Features Filter */}
            <div>
              <Text strong className="block mb-3 text-gray-700">Features</Text>
              <Checkbox.Group 
                value={selectedFeatures} 
                onChange={handleFeatureChange}
                className="w-full"
              >
                <div className="space-y-3">
                  <Checkbox value="free-shipping" className="w-full">
                    <div className="flex flex-col">
                      <span>Free Shipping</span>
                      <Text type="secondary" className="text-xs">Orders $50+</Text>
                    </div>
                  </Checkbox>
                  <Checkbox value="on-sale" className="w-full">
                    <div className="flex flex-col">
                      <span>On Sale</span>
                      <Text type="secondary" className="text-xs">Discounted items</Text>
                    </div>
                  </Checkbox>
                  <Checkbox value="in-stock" className="w-full">
                    <div className="flex flex-col">
                      <span>In Stock</span>
                      <Text type="secondary" className="text-xs">Available now</Text>
                    </div>
                  </Checkbox>
                  <Checkbox value="highly-rated" className="w-full">
                    <div className="flex flex-col">
                      <span>Highly Rated</span>
                      <Text type="secondary" className="text-xs">4.0+ stars</Text>
                    </div>
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </div>
            
            <Divider />
            
            {/* Categories Filter */}
            <div>
              <Text strong className="block mb-3 text-gray-700">Filter by Categories</Text>
              <Checkbox.Group 
                value={selectedBrands} 
                onChange={handleBrandChange}
                className="w-full"
              >
                <div className="space-y-2">
                  {brands.map(brand => (
                    <Checkbox key={brand} value={brand} className="w-full">
                      {brand}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </div>
            
            {/* Filter Results Summary */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <Text className="text-sm text-blue-800">
                <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''} match your filters
              </Text>
            </div>
          </div>
        </Drawer>

        {/* Enhanced Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Empty
              description={
                <div>
                  <Text className="text-lg text-gray-600 block mb-2">No products found</Text>
                  <Text type="secondary">
                    Try adjusting your search criteria or filters
                  </Text>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Space>
                <Button type="primary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
                <Button onClick={() => navigate('/products')}>
                  Browse All Products
                </Button>
              </Space>
            </Empty>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {paginatedProducts.map(product => (
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <Card 
                  key={product.id} 
                  className="rounded-xl shadow-sm hover:shadow-md transition-shadow border-0"
                  bodyStyle={{ padding: '20px' }}
                >
                  <div className="flex gap-6">
                    <div className="relative group cursor-pointer" onClick={() => handleProductView(product.id)}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                        <EyeOutlined className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Title 
                          level={4} 
                          className="mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleProductView(product.id)}
                          ellipsis={{ rows: 1 }}
                        >
                          {product.name}
                        </Title>
                        <Button 
                          type="text" 
                          icon={<HeartOutlined />} 
                          className="text-gray-400 hover:text-red-500"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color="blue" className="text-xs">{product.category}</Tag>
                        <Rate disabled defaultValue={product.rating || 4} size="small" />
                        <Text type="secondary" className="text-sm">
                          ({product.reviews || 128} reviews)
                        </Text>
                      </div>
                      
                      <Text className="text-gray-600 mb-4 line-clamp-2">
                        {product.description || 'High-quality product with excellent features and performance.'}
                      </Text>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Title level={3} className="text-blue-600 m-0">${product.price}</Title>
                          <Badge 
                            count={(product.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'} 
                            style={{ backgroundColor: (product.stock ?? 0) > 0 ? '#52c41a' : '#ff4d4f' }}
                          />
                        </div>
                        <Space>
                          <Button 
                            icon={<EyeOutlined />}
                            onClick={() => handleProductView(product.id)}
                          >
                            View
                          </Button>
                          <Button 
                            type="primary" 
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            Add to Cart
                          </Button>
                        </Space>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-6">
            {paginationType === 'pagination' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border-0">
                <Pagination
                  current={currentPage}
                  total={totalProducts}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} products`
                  }
                  pageSizeOptions={['12', '24', '48', '96']}
                  className="text-center"
                />
              </div>
            )}

            {paginationType === 'loadMore' && paginatedProducts.length < totalProducts && (
              <div className="text-center">
                <Button 
                  type="primary" 
                  size="large"
                  loading={loadingMore}
                  onClick={handleLoadMore}
                  className="px-8 h-12 rounded-lg"
                >
                  {loadingMore ? 'Loading...' : `Load More Products (${totalProducts - paginatedProducts.length} remaining)`}
                </Button>
                <div className="mt-4">
                  <Text type="secondary" className="text-sm">
                    Showing {paginatedProducts.length} of {totalProducts} products
                  </Text>
                  <div className="w-64 mx-auto mt-2">
                    <Progress 
                      percent={Math.round((paginatedProducts.length / totalProducts) * 100)} 
                      strokeColor="#1890ff"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            )}

            {paginationType === 'infinite' && (
              <div className="text-center">
                {loadingMore && (
                  <div className="py-8">
                    <Spin size="large" />
                    <Text className="block mt-4 text-gray-600">Loading more products...</Text>
                  </div>
                )}
                {paginatedProducts.length >= totalProducts && (
                  <div className="py-8">
                    <Text type="secondary" className="text-lg">
                      🎉 You've seen all {totalProducts} products!
                    </Text>
                    <div className="mt-4">
                      <Button 
                        type="primary" 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="mr-4"
                      >
                        Back to Top
                      </Button>
                      <Button onClick={clearAllFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <Text className="text-2xl font-bold text-blue-600 block">{totalProducts}</Text>
                  <Text type="secondary" className="text-sm">Total Products</Text>
                </div>
                <div>
                  <Text className="text-2xl font-bold text-green-600 block">{categories.length}</Text>
                  <Text type="secondary" className="text-sm">Categories</Text>
                </div>
                <div>
                  <Text className="text-2xl font-bold text-orange-600 block">{brands.length}</Text>
                  <Text type="secondary" className="text-sm">Brands</Text>
                </div>
                <div>
                  <Text className="text-2xl font-bold text-purple-600 block">
                    {Math.round((filteredProducts.filter(p => (p.rating ?? 0) >= 4).length / filteredProducts.length) * 100) || 0}%
                  </Text>
                  <Text type="secondary" className="text-sm">Highly Rated</Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;