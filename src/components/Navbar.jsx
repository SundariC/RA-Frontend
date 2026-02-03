import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Check if user is logged in
    const isLoggedIn = window.localStorage.getItem("userID");

    useEffect(() => {
        const handleScroll = () => {
            // "scrolly" spelling fix -> "scrollY"
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        window.localStorage.removeItem("userID");
        window.localStorage.removeItem("token"); // Token-aiyum remove pannalaam
        navigate("/auth");
        window.location.reload(); // Navbar update aaga refresh
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">

                {/* LOGO */}
                <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1A1A1A]">
                    RECIPE <span className="text-[#FF4500]">ARENA</span>
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center space-x-8 font-medium text-sm uppercase tracking-widest text-[#1A1A1A]">
                    <Link to="/" className="hover:text-[#FF4500] transition">Home</Link>
                    
                    {isLoggedIn && (
                        <Link to="/dashboard" className="hover:text-[#FF4500] transition">My Dashboard</Link>
                    )}

                    <div className="flex items-center space-x-4 ml-6 border-l pl-6 border-gray-200">
                        <Search className="w-5 h-5 cursor-pointer hover:text-[#FF4500]" />
                        
                        {/* Auth Logic for User Icon */}
                        {!isLoggedIn ? (
                            <Link to="/auth" className="flex items-center gap-1 hover:text-[#FF4500]">
                                <User className="w-5 h-5" />
                                <span className="text-[10px]">Login/SignUp</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" title="Dashboard">
                                    <LayoutDashboard className="w-5 h-5 text-[#FF4500]" />
                                </Link>
                                <button onClick={logout} title="Logout">
                                    <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* MOBILE MENU ICONS */}
                <div className="md:hidden flex items-center gap-4">
                    {!isLoggedIn ? (
                        <Link to="/auth"><User className="w-5 h-5 text-[#1A1A1A]" /></Link>
                    ) : (
                        <Link to="/dashboard"><LayoutDashboard className="w-5 h-5 text-[#FF4500]" /></Link>
                    )}
                    
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE DROPDOWN */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col space-y-4 font-bold text-gray-700 uppercase tracking-widest text-sm">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>My Dashboard</Link>
                            <button onClick={logout} className="text-left text-red-500 uppercase">Logout</button>
                        </>
                    ) : (
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login / Signup</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;