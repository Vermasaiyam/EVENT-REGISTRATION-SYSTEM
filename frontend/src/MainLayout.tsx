import { Outlet } from "react-router-dom"
// import Footer from "./components/Footer"
import Navbar from "./components/Navbar"


const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <Navbar />
            </header>
            {/* Main content  */}
            <div className="flex-1">
                <Outlet />
            </div>

            {/* Footer  */}
            {/* <footer>
                <Footer />
            </footer> */}
        </div>
    )
}

export default MainLayout