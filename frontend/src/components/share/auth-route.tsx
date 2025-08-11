import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from 'redux/hook'

interface IProps {
  children: React.ReactNode
}

const AuthRoute = (props: IProps) => {
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  )
  const isLoading = useAppSelector((state) => state.account.isLoading)

  return (
    <>
      {isLoading === true ? (
        <>Loading...</>
      ) : (
        <>
          {isAuthenticated === true ? (
            <>{props.children}</>
          ) : (
            <Navigate to="/login" replace />
          )}
        </>
      )}
    </>
  )
}

export default AuthRoute
