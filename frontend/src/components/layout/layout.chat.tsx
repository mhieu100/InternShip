import { Outlet } from "react-router-dom"
import Header from "./client/header.client"

const LayoutChat = () => {
    return (
        <>
            <Header />
            <Outlet />
         
        </>
    )
}

export default LayoutChat