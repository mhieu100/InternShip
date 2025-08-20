import { Outlet } from 'react-router-dom'
import Header from './client/header.client'
import Footer from './client/footer.client'

const LayoutClient = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default LayoutClient
