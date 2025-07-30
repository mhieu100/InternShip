import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setUser, logout } from '@/store/slices/authSlice';
import { callProfile } from '@/services/api';
import { STORAGE_KEYS, HTTP_STATUS } from '@/constants';
import { message } from 'antd';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthentication, user } = useSelector((state) => state.auth);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (token) {
      try {
        const res = await callProfile();
        if (res && res.statusCode === HTTP_STATUS.OK) {
          dispatch(setUser(res.data));
        }
      } catch (error) {
        message.error("Server disconnect! " + error);
        handleLogout();
      }
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated: isAuthentication,
    user,
    initializeAuth,
    logout: handleLogout
  };
};