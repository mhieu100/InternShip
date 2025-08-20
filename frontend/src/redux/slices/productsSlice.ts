import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IProduct } from '../../types/backend'

interface IState {
  products: IProduct[]
  loading: boolean
  error: string | null
  categories: string[]
  selectedCategory: string
  searchTerm: string
  category: string
  priceRange: [number, number]
}

const initialState: IState = {
  products: [],
  loading: false,
  error: null,
  categories: ['All', 'Electronics', 'Fashion', 'Home', 'Accessories'],
  selectedCategory: 'All',
  searchTerm: '',
  category: '',
  priceRange: [0, 1000]
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        category: 'Electronics',
        description: 'High-quality wireless headphones with noise cancellation',
        rating: 4.5,
        stock: 50,
        reviews: 100
      },
      {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        category: 'Electronics',
        description: 'Advanced smartwatch with health monitoring features',
        rating: 4.7,
        stock: 30,
        reviews: 100
      },
      {
        id: 3,
        name: 'Running Shoes',
        price: 79.99,
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
        category: 'Fashion',
        description: 'Comfortable running shoes for daily exercise',
        rating: 4.3,
        stock: 100,
        reviews: 100
      },
      {
        id: 4,
        name: 'Coffee Maker',
        price: 149.99,
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
        category: 'Home',
        description: 'Premium coffee maker for the perfect brew',
        rating: 4.6,
        stock: 25,
        reviews: 100
      },
      {
        id: 5,
        name: 'Laptop Backpack',
        price: 49.99,
        image:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
        category: 'Accessories',
        description: 'Durable laptop backpack with multiple compartments',
        rating: 4.4,
        stock: 75,
        reviews: 100
      },
      {
        id: 6,
        name: 'Bluetooth Speaker',
        price: 59.99,
        image:
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
        category: 'Electronics',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        rating: 4.2,
        stock: 60,
        reviews: 100
      }
    ]
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        // state.error = action.error.message;
      })
  }
})

export const { setSearchTerm, setCategory, setPriceRange } =
  productsSlice.actions
export default productsSlice.reducer
