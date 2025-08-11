// GoogleLoginButton.js
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import axios from '../services/axios-customize'
import { useAppDispatch } from 'redux/hook'
import { setUserLogin } from 'redux/slices/authSlice'
import { useNavigate } from 'react-router'
import { message } from 'antd'

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse) => {
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
    <GoogleOAuthProvider clientId="870851234800-qlpc3aa55r78vna6ae83ub6guhsp5bc3.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
      />
    </GoogleOAuthProvider>
  )
}

export default GoogleLoginButton
