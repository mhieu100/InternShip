import { Navigate } from 'react-router-dom'
import { useAppSelector } from 'redux/hook'
import NotPermit from '../not.permit'

interface IProps {
  children: React.ReactNode
}

const RoleBaseRoute = (props: IProps) => {
  const { user } = useAppSelector((state) => state.account)

  if (user.role === 'ADMIN') {
    return <>{props.children}</>
  } else {
    return <NotPermit />
  }
}

const ProtectedRoute = (props: IProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.account)
  return (
    <>
      {isAuthenticated === true ? (
        <RoleBaseRoute>{props.children}</RoleBaseRoute>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  )
}

export default ProtectedRoute
