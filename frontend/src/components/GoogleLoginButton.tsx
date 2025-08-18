// GoogleLoginButton.tsx
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
  googleLogout
} from '@react-oauth/google'
import axios from '../services/axios-customize'
import { useAppDispatch } from 'redux/hook'
import { setUserLogin } from 'redux/slices/authSlice'
import { useNavigate } from 'react-router'
import { message } from 'antd'
import { useEffect, useState } from 'react'

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [key, setKey] = useState(0)

  useEffect(() => {
    // Clear any existing Google session when component mounts
    googleLogout()
    // Force re-render with new key
    setKey((prev) => prev + 1)
  }, [])

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      message.error('Login failed - no credential received')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:8081/api/auth/google',
        {
          token: credentialResponse.credential
        }
      )
      // Lưu JWT token nhận được từ backend
      dispatch(setUserLogin(response.data.user))
      localStorage.setItem('access_token', response.data.access_token)
      message.success('Login successful!')

      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <GoogleOAuthProvider
      key={key}
      clientId="870851234800-qlpc3aa55r78vna6ae83ub6guhsp5bc3.apps.googleusercontent.com"
    >
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-md">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log('Login Failed')
            message.error('Đăng nhập Google thất bại')
          }}
          size="large"
          theme="outline"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
          cancel_on_tap_outside={true}
          auto_select={false}
          use_fedcm_for_prompt={false}
        />
      </div>
    </GoogleOAuthProvider>
  )
}

export default GoogleLoginButton
