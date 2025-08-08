import { Outlet } from "react-router-dom"
import Header from "./client/header.client"
import Footer from "./client/footer.client"

const LayoutChat = () => {
    return (
        <>
            <Header />
            <Outlet />
         
        </>
    )
}

export default LayoutChat