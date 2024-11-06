import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const MainLayout = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollPos, setLastScrollPos] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            if (currentScrollPos < lastScrollPos) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
            
            setLastScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollPos]);

    return (
        <div className="flex flex-col min-h-screen">
            <header className={`fixed w-full transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} z-20`}>
                <Navbar />
            </header>
            
            {/* Offset for fixed header height */}
            <div className="pt-[64px] flex-1">
                <Outlet />
            </div>

            {/* Footer */}
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;
