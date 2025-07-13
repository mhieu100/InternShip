import React from 'react'
import ProtectedRoute from './protected.route'
import { useSelector } from 'react-redux'
import PermissionPage from '../pages/error/permission'

const AccessDenied = ({children}) => {
    const user = useSelector(state => state.auth.user)
    if (user?.role !== 'ADMIN') {
        return <PermissionPage />;
    }
    return (
    <ProtectedRoute>
     {children}  
    </ProtectedRoute>
  )
}

export default AccessDenied