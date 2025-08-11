import { Outlet } from 'react-router-dom'
import Header from './client/header.client'

const LayoutUnFooter = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default LayoutUnFooter
